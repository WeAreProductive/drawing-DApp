import axios from "axios";
import { ethers } from "ethers";
import {
  rollup_server,
  send_voucher,
  send_notice,
  send_report,
  send_exception,
} from "./lib/rollups-api.mjs";
import { validateDrawing } from "./lib/drawing.mjs";
import {
  str2hex,
  hex2arr,
  getCurrentDate,
  getCurrentTimestamp,
  clean_header,
} from "./lib/utils.mjs";
import pako from "pako";

/**
 * Prepare mint nft voucher's data
 * while saving a notice
 * with nft's data
 * @param {String} msg_sender
 * @param {String} uuid
 * @param {String} erc721_to_mint
 * @param {String} mint_header
 * @param {String} imageIPFSMeta
 * @param {String} imageBase64
 * @param {String} drawing_input
 * @param {String} cmd
 */
const mint_erc721_with_string = async (
  msg_sender,
  uuid,
  erc721_to_mint,
  mint_header, // selector
  imageIPFSMeta, // string
  // imageBase64, @TODO new BE validation
  drawing_input,
  cmd
) => {
  // const validateBase64 = await validateDrawing(drawing_input, imageBase64); @TODO new BE validation

  // if (validateBase64 === true) { @TODO new BE validation
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
  const voucher = {
    destination: erc721_to_mint,
    payload: payload,
  };
  await send_voucher(voucher);
  await store_drawing_data(
    msg_sender,
    uuid,
    drawing_input, // notice drawing data needs the svg only
    cmd
  );
  // } else {
  //   let msg = `Error: Invalid INPUT PNG file.`;
  //   console.log(msg);
  //   await send_report({ payload: str2hex(msg) });
  // } @TODO new BE validation
};
/**
 * Emit a notice
 * Save drawing data in a notice
 * @param {String} sender
 * @param {String} uuid
 * @param {Object} drawing_input
 * @param {String} cmd
 */
const store_drawing_data = async (sender, uuid, drawing_input, cmd) => {
  console.log("Store drawing data in a notice");
  const { content } = JSON.parse(drawing_input.drawing); // current session drawing objects
  const now = getCurrentDate(); // 'YYYY-MM-DD'
  const newLogItem = {
    date_updated: now,
    painter: sender,
    action: cmd,
    drawing_objects: content, // tracks the drawing layers (the canvas drawing objects of each drawing session)
  };
  if (cmd == "cn" || cmd == "cv") {
    // set drawing id wneh new drawing
    const unix_timestamp = getCurrentTimestamp();
    drawing_input.id = `${sender}-${unix_timestamp}`;
    drawing_input.uuid = uuid;
    drawing_input.owner = sender;
    drawing_input.date_created = now;
    drawing_input["last_updated"] = now;
    drawing_input.update_log = [];
    drawing_input.update_log.push(newLogItem); // every calls adds a new log item
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
  const payload = str2hex(JSON.stringify(drawing_input));
  const notice = { payload: payload };
  await send_notice(notice);
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
    payload = hex2arr(payload); // Decodes a hex string into a Uint8Array.
    try {
      const decompressedPayload = pako.inflate(payload, {
        to: "string",
      });
      console.log("Trying to decode json");
      // try json data
      const jsonData = JSON.parse(decompressedPayload);
      const {
        cmd,
        imageIPFSMeta,
        erc721_to_mint,
        selector,
        uuid,
        imageBase64,
        drawing_input,
      } = jsonData;
      if (cmd) {
        if (cmd == "cv" || cmd == "uv") {
          console.log(`COMMAND: ${cmd}`);
          if (imageIPFSMeta && erc721_to_mint && selector) {
            await mint_erc721_with_string(
              sender,
              uuid,
              erc721_to_mint,
              selector,
              imageIPFSMeta,
              // imageBase64, @TODO new BE validation
              drawing_input,
              cmd
            );
          }
        } else if (cmd == "cn" || cmd == "un") {
          console.log(`COMMAND: ${cmd}`);
          if (drawing_input) {
            await store_drawing_data(sender, uuid, drawing_input, cmd);
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
    let msg = `Error: ${error}`;
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
async function handle_inspect(request) {
  data = request.data;
  console.log("Received inspect request data.");
  console.log("Adding report.");
  const report = { payload: data.payload };
  send_report(report);
  return "accept";
}

var finish = { status: "accept" };

(async () => {
  while (true) {
    const res = await axios.post(
      rollup_server + "/finish",
      JSON.stringify({ status: "accept" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Received finish status " + res.status);
    if (res.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      switch (res.data.request_type) {
        case "advance_state":
          finish["status"] = await handle_advance(res.data.data);
          break;
        case "inspect_state":
          finish["status"] = await handle_inspect(res.data.data);
          break;
      }
    }
  }
})();
