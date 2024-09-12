import base64
from os import environ
import sys
import logging
import zlib
import requests
from eth_abi import encode
import traceback
import json
from datetime import datetime, timezone
import numpy as np

# # @TODO
# 1 - check the dApp is bulding
# 2 - check is working on host mode - 
# ------- emits notices
# ------- emits vouchers
# 3 - check is working on prod mode - 
# ------- emits notices
# ------- emits vouchers
# ------- minting

# @TODO move helper functions in utils file/folder
# document functions in python
# @TODO move api - post, get request functions in rollups-api file/folder
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

##
# Helper Functions 

def str2hex(string):
    """
    Encode a string as a hex string
    """
    return binary2hex(str2binary(string))

def str2binary(string):
    """
    Encode a string as a binary string
    """
    return string.encode("utf-8")

def binary2hex(binary):
    """
    Encode a binary as a hex string
    """
    return "0x" + binary.hex()


def hex2binary(hexstr):
    """
    Decodes a hex string into a regular byte string
    """
    return bytes.fromhex(hexstr[2:])

def hex2str(hexstr):
    """
    Decodes a hex string into a regular string
    """
    return hex2binary(hexstr).decode("utf-8")

def decompress(hexstr): 
    """
    Decodes a hex string into a bytearray
    The bytearray is compressed data
    """
    bytearray_data = bytearray.fromhex(hexstr[2:])
    decompressed = zlib.decompress(bytearray_data)

    return decompressed

def clean_header(mint_header):
    if mint_header[:2] == "0x":
        mint_header = mint_header[2:]
    mint_header = bytes.fromhex(mint_header)
    return mint_header


## 
# Api functions

def send_voucher(voucher):
    send_post("voucher",voucher)

def send_notice(notice):
    send_post("notice",notice)

def send_report(report):
    send_post("report",report)

def send_exception(exception):
    send_post("exception",exception)

def send_post(endpoint,json_data):
    response = requests.post(rollup_server + f"/{endpoint}", json=json_data)
    logger.info(f"/{endpoint}: Received response status {response.status_code} body {response.content}")


##
# Core functions


# Prepare voucher to mint nft
# while saving a notice
# with nft's data
# @param {String} msg_sender
# @param {String} uuid
# @param {String} erc721_to_mint
# @param {String} mint_header
# @param {String} imageIPFSMeta
# @param {String} imageBase64
# @param {String} drawing_input
# @param {String} cmd


def mint_erc721_with_string(
        msg_sender,
        uuid,
        erc721_to_mint,
        mint_header,
        imageIPFSMeta,
        drawing_input,
        cmd
    ):
    logger.info(f"Preparing a VOUCHER for MINTING AN NFT")
    mint_header = clean_header(mint_header)
    data = encode(['address', 'string'], [msg_sender,imageIPFSMeta])
    payload = f"0x{(mint_header+data).hex()}"
    voucher = {
        "destination": erc721_to_mint, 
        "payload": payload
    }
    logger.info(f"Voucher {voucher}")
    send_voucher(voucher)

    store_drawing_data(
      msg_sender,
      uuid,
      drawing_input,
      cmd
    )

#  Prepare notice
#  Save drawing data in a notice
#  @param {String} sender
#  @param {String} uuid
#  @param {Object} drawing_input
#  @param {String} cmd

def store_drawing_data(
        sender,
        uuid,
        drawing_input, 
        cmd
    ):
    now = str(datetime.now(timezone.utc)) 
    logger.info(f"Preparing notice payload")
    drawing = drawing_input['drawing']
    
    parsed_drawing = json.loads(drawing)
    content = parsed_drawing['content']
   
    new_log_item = { 
        "date_updated": now,
        "painter": sender, # @TODO use owner
        "action": cmd,
        "drawing_objects": content # tracks the drawing layers (the canvas drawing objects of each drawing session)
    } 

    if cmd == 'cn' or cmd == 'cv':
        # set drawing id wneh new drawing
        # unix_timestamp = str((datetime.utcnow() - datetime(1970, 1, 1)).total_seconds())
        # drawing_input["id"]= f"{sender}-{unix_timestamp}"
        drawing_input["uuid"]= uuid
        drawing_input["owner"] = sender
        drawing_input["date_created"]= now 
        drawing_input["last_updated"] = now
        drawing_input["update_log"] = []
        drawing_input["update_log"].append(new_log_item) 
        if cmd == 'cv':
            drawing_input['voucher_requested'] = True
        else:
            drawing_input['voucher_requested'] = False
    elif cmd == 'un' or cmd == 'uv':
        drawing_input["uuid"]= uuid
        drawing_input["owner"] = sender
        drawing_input["last_updated"] = now
        drawing_input["update_log"].append(new_log_item)
        if cmd == 'uv':
            drawing_input['voucher_requested'] = True 
    # const compressedStr = pako.deflate(JSON.stringify(drawing_input));
    # data = json.dumps(drawing_input)
    # compressed = zlib.compress(data)
    
    compressed = base64.b64encode(zlib.compress(bytes(json.dumps(drawing_input), "utf-8"))).decode("ascii")
    logger.info(f"Compressed payload {compressed}") 
    # uint8array to hex
   
    payload = str2hex(compressed)
    # payload = binary2hex(compressed)
    logger.info(f"Hexed {payload}") 

    notice = {"payload": payload}
    send_notice(notice)

###
# handlers

def handle_advance(data):
    logger.info(f"Received advance request") 
    status = "accept"
    payload = None
    sender = data["metadata"]["msg_sender"].lower() 
    try:
        payload = data["payload"]
        decompressed_payload = decompress(payload)
        try:
            logger.info(f"Trying to decode json ")
            # try json data
            json_data = json.loads(decompressed_payload) 
            if json_data.get("cmd"):
                if json_data['cmd']== 'cv' or json_data['cmd']== 'uv':
                    logger.info(f"COMMAND {json_data['cmd']}")
                    if json_data.get('imageIPFSMeta') and json_data.get("erc721_to_mint") and json_data.get("selector"): 
                        mint_erc721_with_string(
                            sender,
                            json_data["uuid"], 
                            json_data["erc721_to_mint"],
                            json_data["selector"],
                            json_data['imageIPFSMeta'], 
                            json_data["drawing_input"], 
                            json_data['cmd']
                        )
                elif json_data['cmd']== 'cn' or json_data['cmd']== 'un':
                    logger.info(f"COMMAND {json_data['cmd']}")
                    if json_data.get("drawing_input"): 
                        store_drawing_data(
                            sender,
                            json_data["uuid"],
                            json_data["drawing_input"], 
                            json_data['cmd']
                        )
            else:
                raise Exception('Not supported json operation')
        except Exception as e2:
            msg = f"Not valid json: {e2}"
            traceback.print_exc()
            logger.info(msg)
    except Exception as e:
        status = "reject"
        msg = f"Error: {e}"
        traceback.print_exc()
        logger.error(msg)
        send_report({"payload": str2hex(msg)})   
    return status

def handle_inspect(request):
    data = request["data"]
    logger.info(f"Received inspect request data ")
    logger.info("Adding report")
    report = {"payload": data["payload"]}
    send_report(report)
    return "accept"

handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}
rollup_address = None

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json() 
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])