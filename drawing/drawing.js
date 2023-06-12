// Copyright 2022 Cartesi Pte. Ltd.
//
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

const { ethers } = require("ethers");
const { base64 } = require("ethers/lib/utils");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const mint_erc721_with_uri_from_image = (
  msg_sender,
  erc721_to_mint,
  mint_header,
  b64out
) => {
  mint_erc721_with_string(
    msg_sender,
    erc721_to_mint,
    mint_header,
    "QmVnsFfpytX1vohVppn1C5cgVo66HcXu2VFjepyA7d4i2M"
  );
};

const toHexString = (string) => {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(string));
};

//erc721_to_mint the nft smart contract address

const mint_erc721_with_string = (
  msg_sender,
  erc721_to_mint,
  mint_header = "0xd0def521",
  string
) => {
  //string = URIToken = 'QmVnsFfpytX1vohVppn1C5cgVo66HcXu2VFjepyA7d4i2M' @TODO how the URI token is formed
  //STEPS TO REPRODUCE
  // 1. convert svg to base 64 to be valid - accepted from echo plus -
  //   - store the svg
  //   - store the base64
  //   - test that the produced token is ok here - in js
  // 2. manage the steps to produce a token

  const coder = new ethers.utils.AbiCoder();
  const data1 = coder.encode(["address", "string"], [msg_sender, string]);
  const payloadString = `0xd0def521${data1.substring(2)}`; //prepare the payload for the voucher
  const voucher = {
    address: "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9",
    payload: payloadString,
  };
  send_voucher(voucher);
};
const send_voucher = async (voucher) => {
  const req = await fetch(rollup_server + "/voucher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voucher),
  });
  const json = await req.json();
  console.log(
    "Received notice status " +
      req.status +
      " with body " +
      JSON.stringify(json)
  );
};
async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data["payload"];
  try {
    const payloadStr = ethers.utils.toUtf8String(payload);
    console.log(`Adding notice "${payloadStr}"`);
  } catch (e) {
    console.log(`Adding notice with binary value "${payload}"`);
  }
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  const json = await advance_req.json();
  console.log(
    "Received notice status " +
      advance_req.status +
      " with body " +
      JSON.stringify(json)
  );

  mint_erc721_with_uri_from_image(
    data["metadata"]["msg_sender"],
    "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9",
    "0xd0def521",
    " b64out"
  );

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = data["payload"];
  try {
    const payloadStr = ethers.utils.toUtf8String(payload);
    console.log(`Adding report "${payloadStr}"`);
  } catch (e) {
    console.log(`Adding report with binary value "${payload}"`);
  }
  const inspect_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  console.log("Received report status " + inspect_req.status);
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };
var rollup_address = null;

(async () => {
  while (true) {
    console.log("Sending finish");

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
      const metadata = rollup_req["data"]["metadata"];
      if (
        metadata &&
        metadata["epoch_index"] == 0 &&
        metadata["input_index"] == 0
      ) {
        rollup_address = metadata["msg_sender"];
        console.log("Captured rollup address: " + rollup_address);
      } else {
        var handler = handlers[rollup_req["request_type"]];
        finish["status"] = await handler(rollup_req["data"]);
      }
    }
  }
})();
