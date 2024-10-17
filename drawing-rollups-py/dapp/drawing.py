from os import environ
import logging
import zlib
import requests
from eth_abi import encode
import traceback
import json 
from lib.rollups_api import send_notice, send_voucher, send_report
from lib.utils import clean_header, binary2hex, decompress, str2hex, hex2str 
from lib.db_api import store_data, get_data 

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

##
# Core functions 

def mint_erc721_with_string( msg_sender, data ):
    """ Prepares and requests a MINT NFT voucher.
        Triggers the execution of the next function that 
        emmits a notice with the voucher's drawing data.
    Parameters
    ----------
    msg_sender : str
    uuid : str
    erc721_to_mint : str
        The NFT's smart contract address
    mint_header : str
    imageIPFSMeta : str
    imageBase64 : str
    drawing_input : str
    cmd : str
    Raises
    ------
    Returns
    -------
    """
    logger.info(f"Preparing a VOUCHER for MINTING AN NFT {data}")

    mint_header = clean_header( data["selector"] )
    imageIpfs = data["imageIPFSMeta"]

    destination = data["erc721_to_mint"]
    data_for_payload = encode(['address', 'string'], [msg_sender, imageIpfs])
    payload = f"0x{(mint_header+data_for_payload).hex()}"
    voucher = {
        "destination": destination, 
        "payload": payload
    }
    logger.info(f"Voucher {voucher}")
    send_voucher(voucher)
    # uint8array to hex 
    compressed = zlib.compress(bytes(json.dumps(data), "utf-8")) 
    payload = binary2hex(compressed) 
    notice = {"payload": payload}
    send_notice( notice ) 

#  Prepare notice
#  Save drawing data in a notice
#  @param {String} sender
#  @param {String} uuid
#  @param {Object} drawing_input
#  @param {String} cmd

def store_drawing_data( sender, cmd, data ):
    """ Prepares and requests a notice.
        Triggers the execution of the next function that 
        stores the drawing data in the sqlite database.
    Parameters
    ----------
    sender : str 
    cmd : str 
    data : dict
        The drawing's data 
    Raises
    ------
    Returns
    -------
    """
    
    # now = str(datetime.now(timezone.utc))  # convert to timestamp at be

    # drawing_input = data["drawing_input"]

    # drawing = drawing_input['drawing']
    
    # parsed_drawing = json.loads(drawing)
    # content = parsed_drawing['content']
    # # owner is the owner of the drawing
    # # the painter can be different than the drawing owner
    # # only the first drawing layer's painter is the drawing owner for sure
    # drawing_input["uuid"]= data["uuid"]
    # drawing_input["owner"] = data["owner"]
    # drawing_input["painter"] = msg_sender
    # data["date_created"] = now  
    # @TODO add date created  
    # drawing_input["drawing_objects"] = content 
    # drawing_input["private"] = data["private"]
    
    # if cmd == 'cn' or cmd == 'cv':
    #     # drawing_input['log'] = [] #init log
    #     if cmd == 'cv':
    #         drawing_input['voucher_requested'] = True # not in db
    #     else:
    #         drawing_input['voucher_requested'] = False # not in db
    # elif cmd == 'ud' or cmd == 'ud': 
    #     if cmd == 'v-d-nft':
    #         drawing_input['voucher_requested'] = True # not in db
    # notices are needed vor voucher's input 
    # compressed = zlib.compress(bytes(json.dumps(data), "utf-8")) 
    # # uint8array to hex
    # payload = binary2hex(compressed) 

    # notice = {"payload": payload}
    # send_notice( notice ) 
    store_data( cmd, sender, data ) 


###
# handlers

def handle_advance(data):
    """ Handles advanced requests -
        emitting a notice or voucher
    Parameters
    ----------
    data: dict
    Raises
    ------
        Exception
    Returns
    -------
        status : str
        The handling status of the request.
    """
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
                logger.info(f"JSON {json_data}")
                if json_data['cmd'] == 'v-d-nft':
                    logger.info(f"COMMAND {json_data['cmd']}")
                    
                    if json_data.get('imageIPFSMeta') and json_data.get("erc721_to_mint") and json_data.get("selector"):  
                        mint_erc721_with_string( sender, json_data )
                elif json_data['cmd']== 'cd' or json_data['cmd']== 'ud':
                    logger.info(f"COMMAND {json_data['cmd']}")
                    if json_data.get("drawing_input"):  
                        drawing_input = json_data.get("drawing_input")
                        cmd = json_data['cmd']
                        logger.info(f"DRAWING INPUT {json_data['drawing_input']}")
                        store_drawing_data( sender, cmd, drawing_input )
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
    """ Handles inspect requests -
        emitting reports
    Parameters
    ----------
    request: dict
    Raises
    ------
    Returns
    -------
        status : str
        The handling status of the request.
    """
    query_args = hex2str(request['payload'])
    logger.info(f"Inspect state meta data {request}")
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