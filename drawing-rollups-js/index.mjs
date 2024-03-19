// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
import { ethers } from "ethers";
import * as fabric from "fabric/node"; // v6
import fs from "fs";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

// Fabric Test
function toBase64(filePath) {
  const img = fs.readFileSync(filePath);
  return Buffer.from(img).toString("base64");
}

function draw() {
  const fullPath = `./temp-images/`;
  const filePath = fullPath + `temp.png`;

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Directory created successfully`);
  }

  try {
    console.log("Test started");
    const canvas = new fabric.StaticCanvas(null, { width: 600, height: 600 });
    canvas.loadFromJSON(
      '{"objects":[{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":934,"top":246.99,"width":24,"height":490.02,"fill":null,"stroke":"#000000","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",939,251.99],["Q",939,252,939,252.5],["Q",939,253,939,253.5],["Q",939,254,939,256.5],["Q",939,259,939,264],["Q",939,269,939,277],["Q",939,285,939,301],["Q",939,317,940,347],["Q",941,377,945,419.5],["Q",949,462,953,503.5],["Q",957,545,959.5,578],["Q",962,611,962.5,636],["Q",963,661,963,677],["Q",963,693,963,702.5],["Q",963,712,963,717.5],["Q",963,723,963,727],["Q",963,731,962.5,733.5],["Q",962,736,962,739],["L",962,742.01]]},{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":902.99,"top":905.13,"width":125.01,"height":105.88,"fill":null,"stroke":"#000000","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",907.99,950.99],["Q",908,951,908.5,952.5],["Q",909,954,910.5,956.5],["Q",912,959,913.5,962.5],["Q",915,966,917,970.5],["Q",919,975,921,979.5],["Q",923,984,925,988],["Q",927,992,930.5,996],["Q",934,1000,939.5,1004],["Q",945,1008,951,1010.5],["Q",957,1013,962,1014],["Q",967,1015,972,1015.5],["Q",977,1016,981,1016],["Q",985,1016,987.5,1016],["Q",990,1016,992,1015.5],["Q",994,1015,996,1014],["Q",998,1013,1000.5,1012],["Q",1003,1011,1006,1010],["Q",1009,1009,1012,1008],["Q",1015,1007,1017.5,1005.5],["Q",1020,1004,1022.5,1003],["Q",1025,1002,1026.5,1001],["Q",1028,1000,1029.5,998.5],["Q",1031,997,1031.5,994.5],["Q",1032,992,1032.5,989],["Q",1033,986,1033,982.5],["Q",1033,979,1031.5,973.5],["Q",1030,968,1026,961],["Q",1022,954,1017.5,947],["Q",1013,940,1009.5,934.5],["Q",1006,929,1003.5,925],["Q",1001,921,999,918.5],["Q",997,916,995.5,914.5],["Q",994,913,993,912.5],["Q",992,912,990,911.5],["Q",988,911,984.5,911],["Q",981,911,977,910.5],["Q",973,910,968.5,910.5],["Q",964,911,959.5,912],["Q",955,913,951,914],["Q",947,915,943.5,916.5],["Q",940,918,937.5,919],["Q",935,920,933,920.5],["Q",931,921,930,922],["Q",929,923,927.5,924.5],["Q",926,926,925,927.5],["Q",924,929,923,930.5],["Q",922,932,921.5,933],["Q",921,934,921,934.5],["Q",921,935,920,935],["L",918.99,935]]}]}',
      function () {
        canvas.setZoom(1);
        const group = new fabric.Group(canvas.getObjects());
        const x = group.left + group.width / 2 - canvas.width / 2;
        const y = group.top + group.height / 2 - canvas.height / 2;
        canvas.absolutePan({ x: x, y: y });
        const heightDist = canvas.getHeight() - group.height;
        const widthDist = canvas.getWidth() - group.width;
        let groupDimension = 0;
        let canvasDimension = 0;

        if (heightDist < widthDist) {
          groupDimension = group.height;
          canvasDimension = canvas.getHeight();
        } else {
          groupDimension = group.width;
          canvasDimension = canvas.getWidth();
        }
        const zoom = (canvasDimension / groupDimension) * 0.8;
        canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);

        canvas.renderAll();
        try {
          const out = fs.createWriteStream(filePath);
          const stream = canvas.createPNGStream();
          stream.pipe(out);
          out.on("finish", async () => {
            console.log("The PNG file was created.");
            const base64String = toBase64(filePath);
            console.log("Base64: ", base64String);
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
draw();
// Fabric Test End

const send_voucher = (voucher) => {
  send_post("voucher", voucher);
};

const send_notice = (notice) => {
  send_post("notice", notice);
};

const send_report = (report) => {
  send_post("report", report);
};

const send_exception = (exception) => {
  send_post("exception", exception);
};

const send_post = async (endpoint, jsonData) => {
  const response = await fetch(rollup_server + `/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData), // @TODO revise?
  });
  console.log(
    `/${endpoint}: Received response status ${response.status} body ${response.statusText}`
  );
};

/**
 * Encode a string as a hex string
 * @param {String} string
 */
const str2hex = (string) => {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(string));
};

/**
 * Decodes a hex string into
 * a regular string
 * @param {String} hexstr
 */
const hex2str = (hexstr) => {
  return ethers.utils.toUtf8String(hexstr);
};

/**
 * Decodes a hex string into
 * a regular byte string
 *
 * @param {String} hexstr
 */
const hex2binary = (hexstr) => {
  return ethers.utils.hexlify(hexstr);
};

/**
 * Get current datetime
 * formatted as 'yyyy-mm-dd'
 * @returns String
 */
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

/**
 * Get current timestamp
 * @returns
 */
const getCurrentTimestamp = () => {
  const now = new Date();
  return now.getTime();
};

const clean_header = (mintHeader) => {
  return hex2binary(mintHeader);
};

/**
 * Prepare mint nft voucher's data
 * while saving a notice
 * with nft's data
 * @param {String} msg_sender
 * @param {String} uuid
 * @param {String} erc721_to_mint
 * @param {String} mint_header
 * @param {String} imageIPFSMeta
 * @param {String} drawing_input
 * @param {String} cmd
 */
const mint_erc721_with_string = (
  msg_sender,
  uuid,
  erc721_to_mint,
  mint_header, // selector
  imageIPFSMeta, // string
  drawing_input,
  cmd
) => {
  console.log("Preparing a VOUCHER for MINTING AN NFT");
  const mintHeader = clean_header(mint_header);
  const abiCoder = new ethers.utils.AbiCoder();
  // abiCoder.encode( types , values ) ⇒ string< DataHexString >
  const data = abiCoder.encode(
    ["address", "string"],
    [msg_sender, imageIPFSMeta]
  );
  const payloadStr = `${mintHeader}${data.slice(2)}`.toString(); //toString() is equal to py's hex()
  const payload = `${payloadStr}`;
  voucher = {
    destination: erc721_to_mint,
    payload: payload,
  };
  send_voucher(voucher);
  store_drawing_data(msg_sender, uuid, drawing_input, cmd);
};
/**
 * Emit a notice
 * Save drawing data in a notice
 * @param {String} sender
 * @param {String} uuid
 * @param {Object} drawing_input // @TODO check type
 * @param {String} cmd
 */
const store_drawing_data = (sender, uuid, drawing_input, cmd) => {
  console.log("Store drawing data in a notice");
  console.log(typeof drawing_input);

  const now = getCurrentDate(); // 'YYYY-MM-DD'
  const newLogItem = {
    date_updated: now,
    painter: sender,
    action: cmd,
  };
  if (cmd == "cn" || cmd == "cv") {
    // set drawing id wneh new drawing
    unix_timestamp = getCurrentTimestamp();
    drawing_input.id = `${sender}-${unix_timestamp}`;
    drawing_input.uuid = uuid;
    drawing_input.owner = sender;
    drawing_input.date_created = now;
    drawing_input["last_updated"] = now;
    drawing_input.update_log = [];
    drawing_input.update_log.push(newLogItem);
    if (cmd == "cv") {
      drawing_input.voucher_requested = true;
    } else {
      drawing_input.voucher_requested = false;
    }
  } else if (cmd == "un" || cmd == "uv") {
    drawing_input.uuid = uuid;
    drawing_input.owner = sender;
    drawing_input.last_updated = now;
    drawing_input.update_log.push(newLogItem);
    if (cmd == "uv") {
      drawing_input.voucher_requested = true;
    }
  }
  payload = str2hex(JSON.stringify(drawing_input));
  notice = { payload: payload };
  send_notice(notice);
};

/**
 * Handle advance request
 * @param {Object} data
 * @returns String status
 */
async function handle_advance(data) {
  console.log("Received advance request");

  let status = "accept";
  let payload;
  const sender = data.metadata.msg_sender.toLowerCase();
  try {
    payload = data.payload;
    payload = hex2str(payload); // Decodes a hex string into a regular string.
    try {
      console.log("Trying to decode json");
      // try json data
      const jsonData = JSON.parse(payload);
      const {
        cmd,
        imageIPFSMeta,
        erc721_to_mint,
        selector,
        uuid,
        drawing_input,
      } = jsonData;
      if (cmd) {
        if (cmd == "cv" || cmd == "uv") {
          console.log(`COMMAND: ${cmd}`);
          if (imageIPFSMeta && erc721_to_mint && selector) {
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
        } else if (cmd == "cn" || cmd == "un") {
          console.log(`COMMAND: ${cmd}`);
          if (drawing_input) {
            store_drawing_data(sender, uuid, drawing_input, cmd);
          }
        }
      } else {
        // no cmd provided
        throw Error("Not supported json operation");
      }
    } catch (error) {
      console.log({ error });
    }
  } catch (error) {
    status = "reject";
    msg = `Error: ${e}`;
    console.error(msg);
    send_report({ payload: str2hex(msg) });
  }
  return status;
}

/**
 * Handle inspect request
 *
 * @param {Object} request
 * @returns
 */
// @TODO revise
async function handle_inspect(request) {
  data = request.data;
  console.log("Received inspect request data.");
  console.log("Adding report.");
  report = { payload: data.payload };
  send_report(report);
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
