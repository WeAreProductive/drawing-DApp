# Copyright 2022 Cartesi Pte. Ltd.
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

from os import environ
import sys
import logging
import requests
# from web3_input_decoder import decode_constructor, decode_function
# from web3 import Web3
import traceback
import json
import sqlite3
from eth_abi import decode_abi, encode_abi
# from shapely.geometry import shape, Point
import numpy as np
import cv2
from Cryptodome.Hash import SHA256
import base64
import base58
from protobuf import unixfs_pb2, merkle_dag_pb2

# b'Y\xda*\x98N\x16Z\xe4H|\x99\xe5\xd1\xdc\xa7\xe0L\x8a\x990\x1b\xe6\xbc\t)2\xcb]\x7f\x03Cx'
ERC20_TRANSFER_HEADER = b'Y\xda*\x98N\x16Z\xe4H|\x99\xe5\xd1\xdc\xa7\xe0L\x8a\x990\x1b\xe6\xbc\t)2\xcb]\x7f\x03Cx'
# b'd\xd9\xdeE\xe7\xdb\x1c\n|\xb7\x96\n\xd2Q\x07\xa67\x9bj\xb8[0DO:\x8drHW\xc1\xacx'
ERC721_TRANSFER_HEADER = b'd\xd9\xdeE\xe7\xdb\x1c\n|\xb7\x96\n\xd2Q\x07\xa67\x9bj\xb8[0DO:\x8drHW\xc1\xacx'
# print(Web3.keccak(b"Ether_Transfer"))
ETHER_TRANSFER_HEADER = b'\xf2X\xe0\xfc9\xd3Z\xbd}\x83\x93\xdc\xfe~\x1c\xf8\xc7E\xdd\xca8\xaeA\xd4Q\xd0\xc5Z\xc5\xf2\xc4\xce'

# print(Web3.keccak(b"transfer(address,uint256)")) -> will be called as [token_address].transfer([address receiver],[uint256 amount])
ERC20_WITHDRAWAL_HEADER = b'\xa9\x05\x9c\xbb*\xb0\x9e\xb2\x19X?JY\xa5\xd0b:\xde4m\x96+\xcdNF\xb1\x1d\xa0G\xc9\x04\x9b'
# print(Web3.keccak(b"safeTransferFrom(address,address,uint256)")) -> will be called as [nft_address].safeTransferFrom([address sender],[address receiver],[uint256 id])
ERC721_SAFETRANSFER_HEADER = b'B\x84.\x0e\xb3\x88W\xa7w[Nsd\xb2w]\xf72Pt\xd0\x88\xe7\xfb9Y\x0c\xd6(\x11\x84\xed'
# print(Web3.keccak(b"etherWithdrawal(bytes)")) -> will be called as [rollups_address].etherWithdrawal(bytes) where bytes is ([address receiver],[uint256 amount])
ETHER_WITHDRAWAL_HEADER = b't\x95k\x94\x10\x92\x96h\x8b \xfe\xd5b\xda\x90\xd9N\r\x81\xbe4\x95\x1a\xf8t\xb5\x13\x0bO\x85\xbd\xbb'

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

###
# Aux Functions 

def hex2str(hex):
    """
    Decodes a hex string into a regular string
    """
    return bytes.fromhex(hex[2:]).decode("utf-8")

def str2hex(str):
    """
    Encodes a string as a hex string
    """
    return "0x" + str.encode("utf-8").hex()

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

def check_point_in_fence(fence, latitude, longitude):
    # shapely
    fence = json.loads(fence)
    y = shape(fence)
    x = Point(longitude, latitude)
    return y.contains(x)

def process_sql_statement(statement):
    con = sqlite3.connect("data.db")
    cur = con.cursor()
    cur.execute(statement)
    result = cur.fetchall()
    con.commit()
    con.close()
    return result

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
    pngout = base64.decodebytes(b64out)

    unixf = unixfs_pb2.Data()
    unixf.Type = 2 # file
    unixf.Data = pngout
    unixf.filesize = len(unixf.Data)

    mdag = merkle_dag_pb2.MerkleNode()
    mdag.Data = unixf.SerializeToString()

    data = mdag.SerializeToString()

    h = SHA256.new()
    h.update(data)
    sha256_code = "12"
    size = hex(h.digest_size)[2:]
    digest = h.hexdigest()
    combined = f"{sha256_code}{size}{digest}"
    multihash = base58.b58encode(bytes.fromhex(combined))
    tokenURI = multihash.decode('utf-8') # it is not the ipfs unixfs 'file' hash

    mint_erc721_with_string(msg_sender,erc721_to_mint,mint_header,tokenURI)
    
def mint_erc721_with_string(msg_sender,erc721_to_mint,mint_header,string):
    mint_header = clean_header(mint_header)
    data = encode_abi(['address', 'string'], [msg_sender,string])
    payload = f"0x{(mint_header+data).hex()}"
    voucher = {"address": erc721_to_mint , "payload": payload}
    logger.info(f"voucher {voucher}")
    send_voucher(voucher)
    
    send_notice({"payload": str2hex(str(f"Emmited voucher to mint ERC721 {erc721_to_mint} with the content {string}"))})

def mint_erc721_no_data(msg_sender,erc721_to_mint,mint_header):
    mint_header = clean_header(mint_header)
    data = encode_abi(['address'], [msg_sender])
    payload = f"0x{(mint_header+data).hex()}"
    voucher = {"address": erc721_to_mint , "payload": payload}
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

def handle_advance(request):
    data = request["data"]
    logger.info(f"Received advance request data")
    # logger.info("Adding notice")
    status = "accept"
    payload = None
    try:
        payload = hex2str(data["payload"])
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
                logger.info(f"Trying to decode json")
                # try json data
                json_data = json.loads(payload)
                # check geo data
                if json_data.get("fence") and json_data.get("latitude") and json_data.get("longitude"):
                    latitude = json_data["latitude"]
                    longitude = json_data["longitude"]
                    # logger.info(f"Received geo request lat,long({latitude},{longitude})")
                    # payload = f"{check_point_in_fence(latitude, longitude)}"
                    fence = json_data["fence"]
                    logger.info(f"Received geo request fence ({fence}) lat,long({latitude},{longitude})")
                    payload = f"{check_point_in_fence(fence, latitude, longitude)}"
                # check sql
                elif json_data.get("sql"):
                    sql_statement = json_data["sql"]
                    logger.info(f"Received sql statement ({sql_statement})")
                    payload = f"{process_sql_statement(sql_statement)}"
                elif json_data.get("array"):
                    logger.info(f"Received array to sort ({json_data['array']})")
                    a = np.array(json_data["array"])
                    payload = f"{np.sort(a)}"
                elif json_data.get("image"):
                    b64out = process_image(json_data["image"].encode("utf-8"))
                    payload = f"{b64out}"
                    # if json_data.get("erc721_to_mint") and json_data.get("selector"): @TODO fix the payload shape
                    json_data["erc721_to_mint"] = '0x95401dc811bb5740090279Ba06cfA8fcF6113778'
                    json_data["selector"]= '0xd0def521'
                    mint_erc721_with_uri_from_image(data["metadata"]["msg_sender"],json_data["erc721_to_mint"],json_data["selector"],b64out)
                elif json_data.get("erc721_to_mint") and json_data.get("selector"):
                    logger.info(f"Received mint request to ({json_data['erc721_to_mint']})")
                    if json_data.get("string"):
                        mint_erc721_with_string(data["metadata"]["msg_sender"],json_data["erc721_to_mint"],json_data["selector"],json_data["string"])
                    else:
                        mint_erc721_no_data(data["metadata"]["msg_sender"],json_data["erc721_to_mint"],json_data["selector"])
                else:
                    raise Exception('Not supported json operation')
            except Exception as e2:
                msg = f"Not valid json: {e2}"
                traceback.print_exc()
                logger.info(msg)

    except Exception as e:
        try:
            logger.info(f"Trying to decode deposit")
            handle_tx(data["metadata"]["msg_sender"],data["payload"])
        except Exception as e2:
            status = "reject"
            msg = f"Error executing deposit: {e}"
            # traceback.print_exc()
            logger.error(msg)
            send_report({"payload": str2hex(msg)})

    if not payload:
        payload = data["payload"]
    else:
        payload = str2hex(str(payload))
    notice = {"payload": payload}
    send_notice(notice)

    logger.info(f"Payload is {payload}")
    return status

def handle_tx(sender,payload):
    binary = bytes.fromhex(payload[2:])
    input_header = decode_abi(['bytes32'], binary)[0]
    logger.info(f"header {input_header}")
    voucher = None

    if input_header == ERC20_TRANSFER_HEADER:
        decoded = decode_abi(['bytes32', 'address', 'address', 'uint256', 'bytes'], binary)
        logger.info(f"depositor: {decoded[1]}; erc20: {decoded[2]}; amount: {decoded[3]}; data: {decoded[4]}")
        withdraw_header = ERC20_WITHDRAWAL_HEADER[0:4]
        logger.info(f"withdraw_header() {withdraw_header}")

        # (address tokenAddr, address payable receiver, uint256 value)
        # data = encode_abi(['address', 'address', 'uint256'], [decoded[2],decoded[1],decoded[3]])

        # print(Web3.keccak(b"transfer(address,uint256)")) -> will be called as [token_address].transfer([address receiver],[uint256 amount])
        data = encode_abi(['address', 'uint256'], [decoded[1],decoded[3]])
        # logger.info(f"data {data}")
        # logger.info(f"data(hex) {data.hex()}")
        payload = f"0x{(withdraw_header+data).hex()}"
        # payload = encode_abi(['bytes'], [withdraw_header+data])
        # payload = f"0x{payload.hex()}"
        logger.info(f"voucher_payload(hex) {payload}")
        voucher = {"address": decoded[2] , "payload": payload}
        logger.info(f"voucher {voucher}")

    elif input_header == ERC721_TRANSFER_HEADER:
        decoded = decode_abi(['bytes32', 'address', 'address', 'address', 'uint256', 'bytes'], binary)
        logger.info(f"erc721: {decoded[1]}; caller: {decoded[2]}; prev owner: {decoded[3]}; nftid: {decoded[4]}; data: {decoded[5]}")
        withdraw_header = ERC721_SAFETRANSFER_HEADER[0:4]
        # (address sender, address payable receiver, uint256 nftId) 
        # data = encode_abi(['address', 'address', 'uint256'], [decoded[2],decoded[1],decoded[3]])

        # print(Web3.keccak(b"safeTransferFrom(address,address,uint256)")) -> will be called as [nft_address].transfer([address sender],[address receiver],[uint256 id])
        data = encode_abi(['address', 'address', 'uint256'], [rollup_address,decoded[2],decoded[4]])

        payload = f"0x{(withdraw_header+data).hex()}"
        logger.info(f"voucher_payload(hex) {payload}")
        voucher = {"address": decoded[1] , "payload": payload}
        logger.info(f"voucher {voucher}")

    elif input_header == ETHER_TRANSFER_HEADER:
        decoded = decode_abi(['bytes32', 'address', 'uint256', 'bytes'], binary)
        logger.info(f"depositor: {decoded[1]}; amount: {decoded[2]}; data: {decoded[3]}")
        withdraw_header = ETHER_WITHDRAWAL_HEADER[0:4]
        # (address payable receiver, uint256 value) 
        # data = encode_abi(['address', 'uint256'], [decoded[1],decoded[2]])

        # print(Web3.keccak(b"etherWithdrawal(bytes)")) -> will be called as [rollups_address].etherWithdrawal(bytes) where bytes is ([address receiver],[uint256 amount])
        data = encode_abi(['address', 'uint256'], [decoded[1],decoded[2]])
        data2 = encode_abi(['bytes'],[data])

        payload = f"0x{(withdraw_header+data2).hex()}"
        logger.info(f"voucher_payload(hex) {payload}")
        voucher = {"address": rollup_address , "payload": payload}
        logger.info(f"voucher {voucher}")

    else:
        pass

    if voucher:
        send_voucher(voucher)

def handle_inspect(request):
    data = request["data"]
    logger.info(f"Received inspect request {data}")
    logger.info("Adding report")
    report = {"payload": data["payload"]}
    send_report(report)
    return "accept"

handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}
rollup_address = "0xa37ae2b259d35af4abdde122ec90b204323ed304" # None

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        logger.info(f"Received rollup_request {rollup_request}")
        if "data" in rollup_request and "metadata" in rollup_request["data"]:
            data = rollup_request["data"]
            metadata = data["metadata"]
            if metadata["epoch_index"] == 0 and metadata["input_index"] == 0:
                rollup_address = metadata["msg_sender"]
                logger.info(f"Captured rollup address: {rollup_address}")
                continue
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request)