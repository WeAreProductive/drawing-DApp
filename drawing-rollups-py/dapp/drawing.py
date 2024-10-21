from os import environ
import logging
import zlib
import requests
from eth_abi import encode
import traceback
import json 
from lib.rollups_api import send_notice, send_voucher, send_report
from lib.utils import clean_header, binary2hex, decompress, str2hex, hex2str 
from lib.db_api import store_data, get_data, get_drawing_minting_price, get_drawing_contributors 
import cartesi_wallet.wallet as Wallet
from cartesi_wallet.util import hex_to_str, str_to_hex
# from web3 import Web3

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
# w3 = Web3()

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

    minting_price = get_drawing_minting_price(data['uuid'])

    parsed_minting_price = w3.to_wei(minting_price, 'ether') 
    contributors = get_drawing_contributors( data['uuid'] ) # list of obj, to access a contributor - iterate and call c['painter']

    logger.info(minter_eth_balance.erc20_get('ether'))
    # if parsed_minting_price <= minter_eth_balance :
      #  logger.info(parsed_minting_price)
    #     # callData = encodeFunctionData({
    #     #                 abi: nftContractAbi,
    #     #                 functionName: "mint",
    #     #                 args: [input_data[0], etherDepositExecJSON.jamID],
    #     #             });
    #     #4 emit a voucher with the sender address for minting the nft
    #     #             app.createVoucher({
    #     #                 destination: nft_erc1155_address,
    #     #                 payload: callData,
    #     #             });
      
    # @TODO change the destination, is mint_header enough? or mention the function - mint
    #     mint_header = clean_header( data["selector"] )
    #     imageIpfs = data["imageIPFSMeta"]

    #     destination = data["erc721_to_mint"]
    #     data_for_payload = encode(['address', 'string'], [msg_sender, imageIpfs])
    #     payload = f"0x{(mint_header+data_for_payload).hex()}"
    #     voucher = {
    #         "destination": destination, 
    #         "payload": payload
    #     }
    #     logger.info(f"Voucher {voucher}")
    #     send_voucher(voucher)

    #     uuid = data['uuid']
    #     #2 transfer 10% of the price to the dapp wallet's balance
    #     #3 transfer 90% of the price/number of unique layer creators to each layer creator's balance
    #     update_creators_balance( uuid, msg_sender, wallet)
    #     # uint8array to hex 
    #     compressed = zlib.compress(bytes(json.dumps(data), "utf-8")) 
    #     payload = binary2hex(compressed) 
    #     notice = {"payload": payload}
    #     send_notice( notice ) 
    # else :
    #     raise Exception('Not enough balance to execute the operation')
    
def update_creators_balance( uuid, from_address, wallet, minting_price ):
    # const jam = Jam.getJamByID(jamID); uuid 
    # const totalParticipants = jam.submittedAddresses.size; - get unique layer creators
    # const amountPerParticipant =
    #     parseEther(String(jam.mintPrice)) / BigInt(totalParticipants);

    participants = get_drawing_contributors( uuid ) # @TODO get unique addresses contributed to current drawing

    amount_per_dapp = minting_price * .9
    amount_per_participant = ( minting_price - amount_per_dapp ) / len(participants) 
    for p in participants :
        try :
            wallet.ether_transfer(from_address.lower(), p.lower(), amount_per_participant)
        except Exception as e: 
            msg = f"Error: {e}"
            traceback.print_exc()
            logger.error(msg)
            send_report({"payload": str2hex(msg)})   

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
    logger.info(f"METADATA {data['metadata']}")
    # notice - msg sender is the user wallet address
    # METADATA {'msg_sender': '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', 'epoch_index': 0, 'input_index': 2, 'block_number': 369, 'timestamp': 1729492682}
    # voucher - msg sender is the "etherPortalAddress": "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044",
    # INFO:__main__:METADATA {'msg_sender': '0xffdbe43d4c855bf7e0f105c400a50857f53ab044', 'epoch_index': 0, 'input_index': 3, 'block_number': 380, 'timestamp': 1729492737}
    try:
        payload = data["payload"]
        if sender == ether_portal_address.lower() :
            logger.info(f"Handle ether portal request eith payload {payload}")
        else :
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