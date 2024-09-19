from os import environ
import logging
import zlib
import requests
from eth_abi import encode
import traceback
import json
import sqlite3
from datetime import datetime, timezone 
from lib.rollups_api import send_notice, send_voucher, send_report, send_exception, send_post
from lib.utils import clean_header, binary2hex, decompress, str2hex, hex2str 
from lib.db_api import store_data, get_data


# @TODO document functions python way
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

# connects to internal database
con = sqlite3.connect("drawing.db")


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
    drawing = drawing_input['drawing']
    
    parsed_drawing = json.loads(drawing)
    content = parsed_drawing['content']
    
    drawing_input["uuid"]= uuid
    drawing_input["owner"] = sender
    drawing_input["date_created"] = now  
    drawing_input["action"] = cmd  
    drawing_input["drawing_objects"] = content
    
    if cmd == 'cn' or cmd == 'cv':
        # drawing_input['log'] = [] #init log
        if cmd == 'cv':
            drawing_input['voucher_requested'] = True # not in db
        else:
            drawing_input['voucher_requested'] = False # not in db
    elif cmd == 'un' or cmd == 'uv': 
        if cmd == 'uv':
            drawing_input['voucher_requested'] = True # not in db
    
    compressed = zlib.compress(bytes(json.dumps(drawing_input), "utf-8")) 
    # uint8array to hex
    payload = binary2hex(compressed) 

    notice = {"payload": payload}
    send_notice(notice)
    store_data(drawing_input) 


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
    query_args = hex2str(request['payload'])
    logger.info(f"Received inspect request data {query_args}")
    
    data = get_data(query_args)
    logger.info("Adding report") 
    compressed = zlib.compress(bytes(json.dumps(data), "utf-8")) 
    # uint8array to hex
    payload = binary2hex(compressed)  
    send_report({"payload": payload})    
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