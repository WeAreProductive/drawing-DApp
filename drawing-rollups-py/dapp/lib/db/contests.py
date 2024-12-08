import sqlite3 
import logging
import json   
from lib.db.utils import get_query_offset

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'  

limit = 8
contest_minting_price = 1

def get_raw_data(query_args, type, page = 1):
  """ Executes database query statement.
  Parameters
  ----------
  
  Raises
  ------
    Exception  
  Returns
  -------
    
  """
  conn = None 
  try :
    conn = sqlite3.connect(db_filename) 
    conn.row_factory = sqlite3.Row # receive named results
    cursor = conn.cursor() 
    match type:
      case "get_all_contests": 
        print("get_all_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT * "
        statement = statement + "FROM contests c "
        statement = statement + "ORDER BY d.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [limit, offset]) 
        rows = cursor.fetchall() 
        return rows 

  except Exception as e: 
    msg = f"Error executing statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()

# retrieve data
def get_contests(query_args, type, page): 
  """ Retrieves requested contest data.
  Parameters
  ----------
   
  Raises
  ------
  Returns
  -------
  """
  result = {}
  contests = [] # all contests array result 
  data_rows = get_raw_data(query_args, type, page) 
  
  
  logger.info(f"Contests {data_rows}")
    
  return result

# router
def get_contest_data(query_args):
  """ Entry function for retrieving contest adata.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  Raises
  ------
  Returns
  -------
    list : contest data
  """
  page = 1 # default value
  # decide which get-data handler to use 
  if query_args[0] == 'contests':
      # paginated, expects 3 elements in query_args
      # ['contests', 'page', '1']
      query_type = 'get_all_contests' 
      if len(query_args == 3 ):
        page = int(query_args[2])
  contests = get_contests(query_args, query_type, page) 
  return contests

# store data
def create_contest(data):
  try: 
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()  
    #  [contests, create, contest_data] 
    contest = json.loads(data[2])
    created_by = contest['created_by']
    created_at = contest['created_at']
    #
    contest_data = contest['data']
    logger.info(f"Contest data {contest_data}")
    title = contest_data['title']
    description = contest_data['description']
    active_from = contest_data['activeFrom']
    active_to = contest_data['activeTo']
    minting_active = contest_data['mintingOpen'] 
    logger.info(f"DATA {contest}")
    cursor.execute(
        """
        INSERT INTO contests(created_by, title, description, minting_price, active_from, active_to, minting_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (created_by, title, description, contest_minting_price, active_from, active_to, minting_active, created_at)
    )

    conn.commit()
    id = cursor.lastrowid
    return id 
  except Exception as e: 
    msg = f"Error executing insert statement: {e}" 
    logger.info(f"{msg}")
  finally:
    if conn:
      conn.close()
  return False