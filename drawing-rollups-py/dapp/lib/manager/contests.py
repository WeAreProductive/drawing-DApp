import logging
from lib.db.contests import get_raw_data, update_contest, get_contest_balance
from lib.db.drawings import get_drawings_by_ids
from lib.wallet_api import get_balance, transfer_tokens
from eth_utils import to_wei 
from config import *

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

def manage_contests(query_args):
  if len(query_args) == 3:
    logger.info(f"Current timestamp {query_args[2]}")
    logger.info(f"Manage contests")
    # check for not-yet-final but completed contests   
    contests = get_raw_data(query_args, 'get_not_final_contests', 0, query_args[2])
    if contests:   
      for row in contests:
        contest = dict(row) 
        if contest.get('drawings_ids'):
          data = get_drawings_by_ids(contest['drawings_ids'])
          if data:
            if len(data):
              # winner 
              # Edge case drawings with equal mints
              winner = dict(data[0])
              logger.info(f"The drawing-winner {winner}")
              finalise_contest(contest['id'], winner)

def finalise_contest(contest_id, data):
  """ Finalizes given contest
  Parameters
  ----------
  contest_id: int
  data: dict, drawing winner's data
  Raises
  ----------
  Returns
  ----------
  """
  result = update_contest(contest_id, 'finalise_contest', data)
  if result == True:
    logger.info(f"SUCCESS :: Contest {contest_id} finalised")
    contributors = data['drawing_contributors'].split(',')
    logger.info(f"Contributors {contributors}")
    unique_contributors = list(set(contributors))
    logger.info(f"UNIQUE Contributors :: {unique_contributors}")
    result_distribute_deposit = distribute_contest_deposit(contest_id, unique_contributors)
    if result_distribute_deposit != True:
      logger.info(f"ERROR :: Distribute contest {contest_id} deposit")
    else :
      logger.info(f"SUCCESS :: Distribute contest {contest_id} deposit")
    return result
  else : 
    logger.info(f"ERROR :: finalising contest {contest_id}")
    return False
  
def distribute_contest_deposit(contest_id, contributors):
  try:
    # 1 calculate contest balance
    contest_balance = get_contest_balance(contest_id)
    balance_to_wei = to_wei(contest_balance['contest_balance'], 'ether')
    # 2 calc 10% of the minting price leaves at the dApp wallet
    amount_to_distribute = balance_to_wei * 0.9
    # 3 calc tokens for each contributor
    amount_per_contributor = amount_to_distribute / len(contributors) 
    eth_balance_dapp = get_balance(dapp_wallet_address, True)
    logger.info(f"ETH BALANCE DAPP WALLET CONTEST {eth_balance_dapp}")
    # 4 transfer tokens to contrinutors
    for contributor in contributors : 
      transfer_tokens(dapp_wallet_address, contributor, amount_per_contributor)
  except Exception as e: 
    msg = f"ERROR distributing contest deposit: {e}" 
    logger.info(f"{msg}")
  
  
    