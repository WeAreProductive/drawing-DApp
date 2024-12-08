import logging 
from eth_abi import encode
import traceback 
from lib.rollups_api import send_report, send_voucher
from lib.utils import str2hex 
import cartesi_wallet.wallet as Wallet 
from eth_utils import to_wei, from_wei

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__) 

# wallet py refference https://github.com/jplgarcia/python-wallet/blob/main/dapp.py
wallet = Wallet

def get_balance(address, in_ether = False):
  balance = wallet.balance_get(address)  
  if (in_ether):
    # balance in ether
    wei_balance = balance.ether_get()
    return from_wei(wei_balance, 'ether')
  else:
    # balance in wei
    return balance.ether_get() 

def transfer_tokens(from_address, to_address, amount ):
  try :
    wallet.ether_transfer(from_address.lower(), to_address.lower(), amount)
    # check, @TODO remove
    eth_balance = wallet.balance_get(to_address.lower())  
    balance = eth_balance.ether_get()
    logger.info(f"Balance {balance}")
  except Exception as e: 
      msg = f"Error: {e}"
      traceback.print_exc()
      logger.error(msg)
      send_report({"payload": str2hex(msg)})   

def deposit_tokens(payload, dapp_wallet_address, is_contest_deposit=False) :
  try :
    binary_payload = bytes.fromhex(payload[2:])
    account, amount = wallet._ether_deposit_parse(binary_payload)
   
    if is_contest_deposit:
      account_to_deposit = dapp_wallet_address
    else: 
      account_to_deposit = account
      # wallet.ether_deposit_process(payload)
    logger.info(f"'{amount} ' ether DEPOSITED "
                f"in account '{account_to_deposit}'")
    wallet._ether_deposit(account_to_deposit, amount)
  except Exception as e: 
      msg = f"Error: {e}"
      traceback.print_exc()
      logger.error(msg)
      send_report({"payload": str2hex(msg)})  

def withdraw_tokens(amount, dapp_address_relay_contract, sender) : 
  try :
    amount = to_wei(amount, 'ether')
    # https://docs.cartesi.io/cartesi-rollups/1.5/development/asset-handling/
    voucher = wallet.ether_withdraw(dapp_address_relay_contract, sender.lower(), amount) 
    voucher_json = {
              "destination": voucher.destination, 
              "payload": voucher.payload
          }
    send_voucher(voucher_json)
  except Exception as e : 
    msg = f"Error: {e}"
    traceback.print_exc()
    logger.error(msg)
    send_report({"payload": str2hex(msg)})  
  
  
  