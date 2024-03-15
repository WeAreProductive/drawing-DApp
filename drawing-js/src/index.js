// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers"); 
// @TODO convert all variable and func names to camelCase 
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL; 
console.log("HTTP rollup_server url is " + rollup_server); 
/**
 * 
 * @param {*} sender 
 * @param {*} uuid 
 * @param {*} erc721_to_mint 
 * @param {*} selector 
 * @param {*} imageIPFSMeta 
 * @param {*} drawing_input 
 * @param {*} cmd 
 */
const mint_erc721_with_string = (
  sender,
  uuid, 
  erc721_to_mint,
  selector,
  imageIPFSMeta, 
  drawing_input, 
  cmd
  ) => {
console.log('mint erc721 with string')
}
const  storeDrawingData = ( sender, uuid, drawing_input, cmd ) => { 
  console.log('store input')
}
async function handle_advance(data) {
  console.log("Received advance request");
  // console.log("Received advance request data " + JSON.stringify(data));
  const status = "accept";
  let payload;
  const sender = data.metadata.msg_sender.toLowerCase(); 
  try {
    payload = data.payload;
    payload = ethers.utils.toUtf8String(payload); // Decodes a hex string into a regular string.
    try {
      console.log('Trying to decode json');
      // try json data
      const jsonData = JSON.parse(payload);
      const {cmd, imageIPFSMeta, erc721_to_mint, selector, uuid, drawing_input} = jsonData;
      if (cmd){
        if (cmd == 'cv' || cmd == 'uv'){
          console.log(`COMMAND ${cmd}`)
          if (imageIPFSMeta && erc721_to_mint && selector){
            mint_erc721_with_string( 
              sender,
              uuid, 
              erc721_to_mint,
              selector,
              imageIPFSMeta, 
              drawing_input, 
              cmd
            );
          }
        } else if (cmd == 'cn' || cmd== 'un'){
          console.log(`COMMAND ${cmd}`);
          if (drawing_input){
            storeDrawingData(
              sender,
              uuid,
              drawing_input, 
              cmd
            )
          }
        } 
      } else { // no cmd provided
        throw Error('Not supported json operation');
      }
    } catch (error) {
      console.log({error})
    }
  } catch (error) {
    console.log(error)
  }
  return status;
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
