import logging
from lib.db.contests import get_raw_data, update_contest
from lib.db.drawings import get_drawings_by_ids
from lib.wallet_api import transfer_tokens
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
          if len(data):
            # winner 
            # Edge case drawings with equal mints
            winner = dict(data[0])
            print(f"The drawing-winner {winner}")
            finalise_contest(contest['id'], winner)

            # @TODO
            # get the contributors from `winner`
            # distribute funds
def finalise_contest(contest_id, data):
  result = update_contest(contest_id, 'finalise_contest', data)
  if result == True:
    logger.info(f"Success :: Contest {contest_id} finalised")
    return result
  else : 
    logger.info(f"Error :: finalising contest {contest_id}")
    return False
  
def distribute_contest_deposit(contest_id, participants):
  # 1 @TODO calculate contest balance
  contest_balance = 10
  # 2 calc 10% of the minting price leaves at the dApp wallet
  amount_to_distribute = contest_balance * 0.9
  # 3 calc tokens for each contributor
  amount_per_participant = amount_to_distribute / len(participants) 
  # 4 transfer tokens to contrinutors
  for participant in participants : 
    transfer_tokens(dapp_wallet_address, participant, amount_per_participant)
    