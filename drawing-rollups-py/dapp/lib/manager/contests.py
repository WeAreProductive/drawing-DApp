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
    # @TODO completed are the contests where active_to + minting open is finished
    # calculate active-to + minting-open in seconds before start
    # WHERE (salary + bonus) > 50000;
    # SELECT salary + bonus AS total_compensation
    # FROM employees
    # GROUP BY id
    # HAVING total_compensation > 50000;
    # for the contests tabs 
    ## - incompleted - contests in drawing or minting phase - separate in two tabs - open for drawings & open for minting
    ## - inactive - before starting date
    ## - finished - after the minting phase
    
    # handle each finished contest
    ## get the minters
    ## get the drawings
    ## define the drawing with the most mints
    ## distribute the assets
    ## write in db the winning drawing
    