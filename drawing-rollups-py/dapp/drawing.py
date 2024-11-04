from os import environ
import logging
import zlib
import requests
from eth_abi import encode
import traceback
import json 
from lib.rollups_api import send_notice, send_voucher, send_report
from lib.utils import clean_header, binary2hex, decompress, str2hex, hex2str
from lib.db.drawings import store_data, get_data, get_drawing_minting_price, get_drawing_contributors
from lib.db.contests import create_contest
from lib.wallet_api import get_balance, transfer_tokens, deposit_tokens, withdraw_tokens
import cartesi_wallet.wallet as Wallet
from cartesi_wallet.util import hex_to_str 
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
##
# Core functions 

def mint_erc721_with_string( msg_sender, data, timestamp ):
    """ Entry function for -
            - preparing data for and requests a MINT NFT voucher.
            - updating drawing contributors balances
            - preparing data for and emitting a notice
            - storing minting statistics
    Parameters
    ----------
    msg_sender : str
    data : drawing related data
    timestamp : outside cartesi macine's request timestamp
    
    Raises
    ------
        Exepruion ...
    Returns
    -------
        void
    """
    logger.info(f"Preparing a VOUCHER for MINTING AN NFT {data}")
    # check sender wallet virtual/portal deposited balance ... 
    minter_eth_balance = get_balance(msg_sender)
    logger.info(f"Minter balance {minter_eth_balance}")

    minting_price = to_wei(get_drawing_minting_price(data['uuid']), 'ether') 
    logger.info(f"Minting price {minting_price}")

    if minting_price <= minter_eth_balance : 
        # @TODO - on each step - check success response and proceed
        # 1 - voucher
        mint_header = clean_header( '0xd0def521' )
        imageIpfs = data["imageIPFSMeta"]
        data_for_payload = encode(['address', 'string'], [msg_sender, imageIpfs])
        payload = f"0x{(mint_header+data_for_payload).hex()}"
        voucher = {
            "destination": nft_erc1155_address, 
            "payload": payload
        }
        logger.info(f"Voucher {voucher}")
        send_voucher(voucher)
        # 2 - notice
        compressed = zlib.compress(bytes(json.dumps(data), "utf-8")) 
        payload = binary2hex(compressed) 
        notice = {"payload": payload}
        send_notice( notice ) 
        # 3 - store minting-voucher data
        store_data(data['cmd'], timestamp, msg_sender, data['uuid'])
        # 4 - update contributor balances
        update_creators_balance( data['uuid'], msg_sender, wallet, minting_price )
    else :
        raise Exception('Not enough balance to execute the operation')
    
def update_creators_balance( uuid, from_address, wallet, minting_price ): 
    # 1 get contrubutors(addresses)
    participants = get_drawing_contributors( uuid )  
    # 2 calc 10% of the minting price goes for the dApp
    amount_per_dapp = minting_price * 0.1
    logger.info(f"Amount per the dApp {amount_per_dapp}")
    # 3 calc tokens for each contributor
    amount_per_participant = ( minting_price - amount_per_dapp ) / len(participants) 
    logger.info(f"Amount per participant {amount_per_participant}")
    # 4 transfer tokens to dApp address
    transfer_tokens(from_address, dapp_wallet_address, amount_per_dapp)
    # 5 transfer tokens to contrinutors
    for p in participants : 
        transfer_tokens(from_address, p['painter'], amount_per_participant)

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
    timestamp = data["metadata"]['timestamp'] # outside of the cartesi machine timestamp
    logger.info(f"METADATA {data['metadata']}") # check, @TODO remove
    logger.info(f"METADATA {data}") 
    try:
        if sender == ether_portal_address.lower() : 
            payload = data["payload"] # payload consists of (1) - message sender, (2) amount to deposit ?, (3) - minting data
            msg_sender = payload[:42] 
            logger.info(f"Address {msg_sender}")
            deposit_tokens(payload)
            if len(payload) > 104 : 
                input_data_2 = payload[104:]
                str_data = hex_to_str(input_data_2) 
                json_data = json.loads(str_data) 
                mint_erc721_with_string( msg_sender, json_data, timestamp )
        else :
            payload = data["payload"]
            decompressed_payload = decompress(payload)
            try:
                # try json data
                json_data = json.loads(decompressed_payload)  
                if json_data.get("cmd"):
                    logger.info(f"COMMAND {json_data['cmd']}") 
                    if json_data['cmd'] == 'eth.withdraw':
                        withdraw_tokens(json_data['amount'], dapp_address_relay_contract, sender)
                    else :
                        if json_data.get("drawing_input"):  
                            drawing_input = json_data.get("drawing_input")
                            cmd = json_data['cmd']
                            logger.info(f"DRAWING INPUT {json_data['drawing_input']}")
                            store_data( cmd, timestamp, sender, drawing_input )
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
    logger.info(f"REQUEST {request}")
    if query_args[0] == 'balance':
        user_address = query_args[1]
        eth_balance = get_balance(user_address, True)
        logger.info(f"ETH BALANCE {eth_balance}")
        payload = str2hex(str(eth_balance))
        send_report({"payload": payload}) 
    elif query_args[0] == 'contests':
        if query_args[1] == 'create' :
            create_contest(query_args) 
        payload = str2hex(str(query_args))
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