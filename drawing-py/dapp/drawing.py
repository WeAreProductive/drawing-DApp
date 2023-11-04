from os import environ
import sys
import logging
import requests
import traceback
import json
from eth_abi import encode
# from shapely.geometry import shape, Point
import numpy as np
import cv2
from Cryptodome.Hash import SHA256
import base64
import base58
from protobuf_models import unixfs_pb2, merkle_dag_pb2

DAPP_RELAY_ADDRESS = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE".lower()
ERC721_PORTAL_ADDRESS = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87".lower()

# b'd\xd9\xdeE\xe7\xdb\x1c\n|\xb7\x96\n\xd2Q\x07\xa67\x9bj\xb8[0DO:\x8drHW\xc1\xacx'
ERC721_TRANSFER_HEADER = b'd\xd9\xdeE\xe7\xdb\x1c\n|\xb7\x96\n\xd2Q\x07\xa67\x9bj\xb8[0DO:\x8drHW\xc1\xacx'
# print(Web3.keccak(b"safeTransferFrom(address,address,uint256)")) -> will be called as [nft_address].safeTransferFrom([address sender],[address receiver],[uint256 id])
ERC721_SAFETRANSFER_FUNCTION_SELECTOR = b'B\x84.\x0e\xb3\x88W\xa7w[Nsd\xb2w]\xf72Pt\xd0\x88\xe7\xfb9Y\x0c\xd6(\x11\x84\xed'[:4]

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

##
# Aux Functions 

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

def process_image(image):
    b64str = image
    png = base64.decodebytes(b64str)
    nparr = np.frombuffer(png,np.uint8)
    img = cv2.imdecode(nparr,cv2.IMREAD_UNCHANGED)
    (rows, cols) = img.shape[:2]
    M = cv2.getRotationMatrix2D((cols / 2, rows / 2), 15, 1)
    rotated = cv2.warpAffine(img, M, (cols, rows))
    rotated_png = cv2.imencode('.png',rotated)
    data_encode = np.array(rotated_png[1])
    # gaussian = cv2.GaussianBlur(rotated, (9, 9), 0)
    # gaussian_png = cv2.imencode('.png',gaussian)
    # data_encode = np.array(gaussian_png[1])
    byte_encode = data_encode.tobytes()
    b64out = base64.b64encode(byte_encode)
    return b64out

def mint_erc721_with_uri_from_image(msg_sender,erc721_to_mint,mint_header,b64out):
    logger.info(f"MINTING AN NFT")
    pngout = base64.decodebytes(b64out)# With the help of base64.decodebytes(s) method, we can decode the binary string with the help of base64 data into normal form.

    unixf = unixfs_pb2.Data() # Allow to add IPFS Unixfs objects via a python protobuf interface, https://protobuf.dev/overview/
    unixf.Type = 2 # file
    unixf.Data = pngout
    unixf.filesize = len(unixf.Data)

    mdag = merkle_dag_pb2.MerkleNode()
    mdag.Data = unixf.SerializeToString()

    data = mdag.SerializeToString()

    # SHA-256 belongs to the SHA-2 family of cryptographic hashes. It produces the 256 bit digest of a message.
    # https://pycryptodome.readthedocs.io/en/latest/src/hash/sha256.html
    h = SHA256.new()
    h.update(data)# the image data
    sha256_code = "12"
    # Return the hexadecimal representation of an integer.
    size = hex(h.digest_size)[2:]
    # The sha256() returns a HASH object.
    # So if you want to get the hash as a string, use the hexdigest().
    digest = h.hexdigest()
    combined = f"{sha256_code}{size}{digest}"
    # convert string hex to bytes hex format before feeding it to b58encode to produce base58 str
    multihash = base58.b58encode(bytes.fromhex(combined))
    # decode a string encoded in UTF-8 format
    tokenURI = multihash.decode('utf-8') # it is not the ipfs unixfs 'file' hash

    mint_erc721_with_string(msg_sender,erc721_to_mint,mint_header,tokenURI)
    
def mint_erc721_with_string(msg_sender,erc721_to_mint,mint_header,string):
    mint_header = clean_header(mint_header)
    data = encode(['address', 'string'], [msg_sender,string])
    payload = f"0x{(mint_header+data).hex()}"
    voucher = {"destination": erc721_to_mint , "payload": payload}
    logger.info(f"voucher {voucher}")
    send_voucher(voucher)
    
    send_notice({"payload": str2hex(str(f"Emmited voucher to mint ERC721 {erc721_to_mint} with the content {string}"))})

def mint_erc721_no_data(msg_sender,erc721_to_mint,mint_header):
    mint_header = clean_header(mint_header)
    data = encode(['address'], [msg_sender])
    payload = f"0x{(mint_header+data).hex()}"
    voucher = {"destination": erc721_to_mint , "payload": payload}
    logger.info(f"voucher {voucher}")
    send_voucher(voucher)
    
    send_notice({"payload": str2hex(str(f"Emmited voucher to mint ERC721 {erc721_to_mint}"))})

def clean_header(mint_header):
    if mint_header[:2] == "0x":
        mint_header = mint_header[2:]
    mint_header = bytes.fromhex(mint_header)
    return mint_header

###
# handlers

def handle_advance(data):
    logger.info(f"Received advance request")
    # logger.info("Adding notice")
    logger.info(data)
    status = "accept"
    payload = None
    sender = data["metadata"]["msg_sender"].lower()
    try:
        payload = data["payload"]
        if sender == DAPP_RELAY_ADDRESS:
            logger.info(f"Received advance from dapp relay")
            global rollup_address
            rollup_address = payload
            send_report({"payload": str2hex(f"Set rollup_address {rollup_address}")})
        elif sender in [ERC721_PORTAL_ADDRESS]:
            logger.info(f"Received advance from portal")
            # or was sent by the Portals, which is where deposits must come from
            handle_tx(sender,payload)
        else:
            payload = hex2str(payload)
            logger.info(f"Received str {payload}")
            if payload == "exception":
                status = "reject"
                exception = {"payload": str2hex(str(payload))}
                send_exception(exception)
                sys.exit(1)
            elif payload == "reject":
                status = "reject"
                report = {"payload": str2hex(str(payload))}
                send_report(report)
            elif payload == "report":
                report = {"payload": str2hex(str(payload))}
                send_report(report)
            elif payload[0:7] == "voucher":
                payload = f"{payload}"
                voucher = json.loads(payload[7:])
                send_voucher(voucher)
            elif payload == "notice":
                notice = {"payload": str2hex(str(payload))}
                send_notice(notice)
            else:
                try:
                    logger.info(f"Trying to decode json {payload}")
                    # try json data
                    json_data = json.loads(payload) 
                    logger.info(f'JSON DATA {json_data}')
                    if json_data.get("image"):
                        b64out = process_image(json_data["image"].encode("utf-8"))
                        payload = f"{b64out}"
                        if json_data.get("erc721_to_mint") and json_data.get("selector"):
                            mint_erc721_with_uri_from_image(sender,json_data["erc721_to_mint"],json_data["selector"],b64out)
                    elif json_data.get("erc721_to_mint") and json_data.get("selector"):
                        logger.info(f"Received mint request to ({json_data['erc721_to_mint']})")
                        if json_data.get("string"):
                            mint_erc721_with_string(sender,json_data["erc721_to_mint"],json_data["selector"],json_data["string"])
                        else:
                            mint_erc721_no_data(sender,json_data["erc721_to_mint"],json_data["selector"])
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

    if not payload:
        payload = data["payload"]
    else:
        payload = str2hex(str(payload))
    notice = {"payload": payload}
    send_notice(notice)

    logger.info(f"Notice payload was {payload}")
    return status

def handle_tx(sender,payload):
    binary = hex2binary(payload)
    voucher = None 

    if sender == ERC721_PORTAL_ADDRESS:
        logger.info(f"Received ERC721 deposit")

        token_address = binary2hex(binary[:20])
        depositor = binary2hex(binary[20:40])
        token_id = int.from_bytes(binary[40:72], "big")
        deposit_data = binary[72:]

        # send deposited erc721 back to depositor
        if rollup_address is not None:
            # Function to be called in voucher [token_address].transfer([address sender],[address receiver],[uint256 id])
            receiver = depositor
            data = encode(['address', 'address', 'uint256'], [sender,receiver,token_id])
            voucher_payload = binary2hex(ERC721_SAFETRANSFER_FUNCTION_SELECTOR + data)
            voucher = {"destination": token_address, "payload": voucher_payload}
    
    else:
        pass

    if voucher:
        send_voucher(voucher)
        logger.info(f"Voucher was {voucher}")


def handle_inspect(request):
    data = request["data"]
    logger.info(f"Received inspect request data {data}")
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
