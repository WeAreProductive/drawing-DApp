import sqlite3 
import logging
import json   
from lib.db.utils import get_query_offset

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'  

limit = 8
contest_minting_price = 1

def get_raw_data(query_args, query_type, page, timestamp):
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
    # active_from active_to
    match query_type:
      case "get_active_contests": 
        print("get_active_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT * "
        statement = statement + "FROM contests c "
        statement = statement + "WHERE c.active_from < ? AND "
        statement = statement + "c.active_to > ? "
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [timestamp, timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows  
      case "get_future_contests":  
        print("get_future_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT * "
        statement = statement + "FROM contests c "
        statement = statement + "WHERE c.active_from > ? " 
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows  
      case "get_inactive_contests":  
        print("get_inactive_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT * "
        statement = statement + "FROM contests c "
        statement = statement + "WHERE c.active_to < ? " 
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows   

  except Exception as e: 
    msg = f"Error executing statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()

# retrieve data
def get_contests(query_args, query_type, page, timestamp): 
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
  data_rows = get_raw_data(query_args, query_type, page, timestamp)   
  
  if data_rows: 
    for row in data_rows:   
      # id, created_by, title, description, active_from, active_to, minting_active, minting_price, created_at 
      current_contest = {}
      current_contest['id'] = row['id']
      current_contest['created_by'] = row['created_by']
      current_contest['title'] = row['title']
      current_contest['description'] = row['description']
      current_contest['active_from'] = row['active_from']
      current_contest['active_to'] = row['active_to']
      current_contest['minting_active'] = row['minting_active']
      current_contest['minting_price'] = row['minting_price']
      current_contest['created_at'] = row['created_at']

      contests.append(current_contest)  
  # @TODO has_next page
  result['contests'] = contests 
  return result

# router
def get_query_type(contest_type):
  match contest_type:
    case "active": 
      return "get_active_contests" 
    case "future": 
      return "get_future_contests"
    case "inactive": 
      return "get_inactive_contests" 
    
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
  logger.info(f"CONTESTS {query_args}")
  # decide which get-data handler to use 
  if query_args[0] == 'contests':
      # paginated, expects 3 elements in query_args
      # ['contests', 'page', '1', type, timestamp] 
      if len(query_args) > 2 :
        page = int(query_args[2])
        if len(query_args) > 4: 
          timestamp = query_args[4]
          query_type=get_query_type(query_args[3])
            
  contests = get_contests(query_args, query_type, page, timestamp) 
  logger.info(f"CONTESTS {contests}")
  return json.dumps(contests)

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