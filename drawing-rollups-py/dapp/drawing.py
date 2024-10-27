from os import environ
import logging
import zlib
import requests
from eth_abi import encode
import traceback
import json 
from lib.rollups_api import send_notice, send_voucher, send_report
from lib.utils import clean_header, binary2hex, decompress, str2hex, hex2str , hex2binary
from lib.db_api import store_data, get_data, get_drawing_minting_price, get_drawing_contributors 
import cartesi_wallet.wallet as Wallet
from cartesi_wallet.util import hex_to_str, str_to_hex
# from web3 import Web3
from eth_utils import to_wei, from_wei

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

nft_erc1155_address = '0xb73bDcde8C529A289956B5C9726ecDC4b29309CA' # Simple erc contract address on localhost
ether_portal_address = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044" #open(f'./deployments/{network}/EtherPortal.json')

dapp_address_relay_contract = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e" # localhost
dapp_wallet_address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' # 3rd address from the localhost test address list

# wallet py refference https://github.com/jplgarcia/python-wallet/blob/main/dapp.py
wallet = Wallet
# web3 = Web3()
def decode_json(b):
    s = bytes.fromhex(b[2:]).decode("utf-8")
    d = json.loads(s)
    return d
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

    #1 sender should've transfered the minting price 
    # from its to the wallet virtual instance
    # in FE
    # check sender wallet virtual/portal deposited balance ...
    minter_eth_balance = wallet.balance_get(msg_sender)  
    ether_balance = minter_eth_balance.ether_get()
    # ether_balance = minter_eth_balance.ether_get()
    logger.info(f"Minter balance {ether_balance}")
    minting_price = get_drawing_minting_price(data['uuid'])
    # contributors = get_drawing_contributors( data['uuid'] ) # list of obj, to access a contributor - iterate and call c['painter']
    parsed_price = to_wei(minting_price, 'ether')
    logger.info(f"Parsed price {parsed_price}")
    if parsed_price <= ether_balance : 
        update_creators_balance( data['uuid'], msg_sender, wallet, parsed_price )
        mint_header = clean_header( '0xd0def521' )
        # mint_header = clean_header( data["selector"] )
        
        imageIpfs = data["imageIPFSMeta"]
        data_for_payload = encode(['address', 'string'], [msg_sender, imageIpfs])
        payload = f"0x{(mint_header+data_for_payload).hex()}"
        voucher = {
            "destination": nft_erc1155_address, 
            "payload": payload
        }
        logger.info(f"Voucher {voucher}")
        send_voucher(voucher)
        # uint8array to hex 
        compressed = zlib.compress(bytes(json.dumps(data), "utf-8")) 
        payload = binary2hex(compressed) 
        notice = {"payload": payload}
        send_notice( notice ) 
    else :
        raise Exception('Not enough balance to execute the operation')
    
def update_creators_balance( uuid, from_address, wallet, minting_price ): 
    participants = get_drawing_contributors( uuid )  
    amount_per_dapp = minting_price * 0.1
    logger.info(amount_per_dapp)
    amount_per_participant = ( minting_price - amount_per_dapp ) / len(participants) 
    logger.info(amount_per_participant)
    wallet.ether_transfer(from_address.lower(), dapp_wallet_address.lower(), amount_per_dapp)
    eth_balance = wallet.balance_get(dapp_wallet_address.lower())  
    balance = eth_balance.ether_get()
    logger.info(f"Balance {balance}")
    for p in participants :
        try :
            wallet.ether_transfer(from_address.lower(), p['painter'].lower(), amount_per_participant)
            minter_eth_balance = wallet.balance_get(p['painter'].lower())  
            ether_balance = minter_eth_balance.ether_get()
            logger.info(f"Balance {ether_balance}")
        except Exception as e: 
            msg = f"Error: {e}"
            traceback.print_exc()
            logger.error(msg)
            send_report({"payload": str2hex(msg)})   


def store_drawing_data( sender, timestamp, cmd, data ):
    """ Stores the drawing data in the sqlite database.
    Parameters
    ----------
    sender : str 
    timestamp : str
        Unix timestamp ouside of the cartesi machine
        Comes from the request metada
    cmd : str 
    data : dict
        The drawing's data 
    Raises
    ------
    Returns
    -------
    """  
    store_data( cmd, timestamp, sender, data ) 


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
    timestamp = data["metadata"]['block_timestamp'] # outside of the cartesi machine timestamp
    logger.info(f"METADATA {data['metadata']}")
    logger.info(f"METADATA {data}") 
    try:
        if sender == ether_portal_address.lower() : 
            payload = data["payload"]
            msg_sender = payload[:42]  
            logger.info(f"Address {msg_sender}")
            input_data_1 = payload[42:104]
            logger.info(f"input_data 1 {input_data_1}")  
            wallet.ether_deposit_process(payload)
            if len(payload) > 104 :
                input_data_2 = payload[104:]
                logger.info(f"input 2 {input_data_2}")
                str_data = hex_to_str(input_data_2) 
                json_data = json.loads(str_data) 
                mint_erc721_with_string( msg_sender, json_data )
        else :
            payload = data["payload"]
            decompressed_payload = decompress(payload)
            logger.info(f"Decompressed payload {decompressed_payload}")
            try:
                logger.info(f"Trying to decode json")
                # try json data
                json_data = json.loads(decompressed_payload)  
                if json_data.get("cmd"):
                    logger.info(f"COMMAND {json_data['cmd']}") 
                    if json_data['cmd'] == 'eth.withdraw':
                        amount = to_wei(json_data['amount'], 'ether')
                        # https://docs.cartesi.io/cartesi-rollups/1.5/development/asset-handling/
                        voucher = wallet.ether_withdraw(dapp_address_relay_contract, sender.lower(), amount) 
                        response = requests.post(rollup_server + "/voucher", json={"payload": voucher.payload, "destination": voucher.destination})
                        logger.info(f"Voucher response {response}") 
                    else :
                        if json_data.get("drawing_input"):  
                            drawing_input = json_data.get("drawing_input")
                            cmd = json_data['cmd']
                            logger.info(f"DRAWING INPUT {json_data['drawing_input']}")
                            store_drawing_data( sender, timestamp, cmd, drawing_input )
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
    query_str = hex2str(request['payload'])
    logger.info(f"Received inspect request data {query_str}")
    query_args = query_str.split('/')
    if query_args[0] == 'balance':
        user_address = query_args[1]
        balance = wallet.balance_get(user_address)
        wei_balance = balance.ether_get()
        eth_balance = from_wei(wei_balance, 'ether')
        payload = str2hex(str(eth_balance))
        send_report({"payload": payload})  
    else :
        data = get_data(query_args)
        logger.info(f"DATA before report {data}")
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