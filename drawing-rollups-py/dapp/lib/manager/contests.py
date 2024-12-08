import logging
from lib.db.contests import get_raw_data
logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

def manage_contests(query_args):
  if len(query_args) == 3:
    logger.info(f"Current timestamp {query_args[2]}")
    logger.info(f"Manage contests")
    # check for not-yet-final but completed contests 
   
    contests = get_raw_data(query_args, 'get_not_final_contests', 0, query_args[2])
    logger.info(f"Current timestamp {contests}")
    if contests:   
      for row in contests:
        contest = dict(row)
        print(contest)
    