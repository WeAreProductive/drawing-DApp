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
    # active_from active_to, @TODO count number of contest and pagination has next
    match query_type:
      case "get_active_contests": 
        print("get_active_contests") 
        # # id, created_by, title, description, active_from, active_to, minting_active, minting_price, created_at from contests
        # # uuid from drawings  
        offset = get_query_offset(page)  
        statement = "SELECT COUNT(d.uuid) as drawings_count, * " 
        statement = statement + "FROM contests c "
        statement = statement + "LEFT JOIN drawings d "
        statement = statement + "ON c.id = d.contest_id "
        statement = statement + "WHERE c.active_from < ? AND "
        statement = statement + "c.active_to > ? "
        statement = statement + "GROUP BY c.id "
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?" 
        cursor.execute(statement, [timestamp, timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows  
      case "get_future_contests":  
        print("get_future_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT COUNT(d.uuid) as drawings_count, * "
        statement = statement + "FROM contests c "
        statement = statement + "LEFT JOIN drawings d "
        statement = statement + "ON c.id = d.contest_id "
        statement = statement + "WHERE c.active_from > ? " 
        statement = statement + "GROUP BY c.id "
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows  
      case "get_completed_contests":  
        print("get_completed_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT COUNT(d.uuid) as drawings_count, * "
        statement = statement + "FROM contests c "
        statement = statement + "LEFT JOIN drawings d "
        statement = statement + "ON c.id = d.contest_id "
        statement = statement + "WHERE c.active_to < ? " 
        statement = statement + "GROUP BY c.id "
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows 
      case "get_incompleted_contests":  
        print("get_incompleted_contests") 
        #
        offset = get_query_offset(page)  
        statement = "SELECT * "
        statement = statement + "FROM contests c "
        statement = statement + "WHERE c.active_to > ? " 
        statement = statement + "ORDER BY c.created_at DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [timestamp, limit, offset]) 
        rows = cursor.fetchall() 
        return rows 
      case 'get_contest_by_id':
        print('get_contest_by_id')
        statement = "SELECT c.id, c.created_by, c.title, c.description, c.active_from, c.active_to, c.minting_active, c.minting_price, c.created_at, "
        # statement = "COUNT(d.uuid) as drawings_count, "
        statement = statement + "d.uuid, d.last_updated, d.title as drawing_title, "
        statement = statement + "m.minter, m.drawing_id, "
        statement = statement + "COUNT(m.drawing_id) as mints_count, "
        # statement = statement + "COUNT(DISTINCT d.uuid) as drawings_count, "
        statement = statement + "GROUP_CONCAT(m.drawing_id, ',') AS drawings_uuids "
        statement = statement + "FROM contests c "
        statement = statement + "LEFT JOIN drawings d "
        statement = statement + "ON c.id = d.contest_id "
        statement = statement + "LEFT JOIN mints m "
        statement = statement + "ON d.uuid = m.drawing_id "
        statement = statement + "WHERE c.id = ?" 
        # statement = statement + "GROUP BY c.id " 
        statement = statement + "GROUP BY d.uuid " 
        statement = statement + "ORDER BY mints_count DESC, d.last_updated DESC " 
        # statement = statement + " LIMIT 1" 
        cursor.execute(statement, [query_args[1]]) 
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
    if query_type == 'get_contest_by_id':     
      row_dict = dict(data_rows[0])
      # id, created_by, title, description, active_from, active_to, minting_active, minting_price, created_at 
      current_contest = {}
      current_contest['id'] = row_dict['id']
      current_contest['created_by'] = row_dict['created_by']
      current_contest['title'] = row_dict['title']
      current_contest['description'] = row_dict['description']
      current_contest['active_from'] = row_dict['active_from']
      current_contest['active_to'] = row_dict['active_to']
      current_contest['minting_active'] = row_dict['minting_active']
      current_contest['minting_price'] = row_dict['minting_price']
      current_contest['created_at'] = row_dict['created_at']
      current_contest['mints_statistics'] = []
      current_contest['drawings_count'] = 0
      if row_dict.get('uuid'): # uuid will be null if there are no drawings attached to the contest
        if row_dict['uuid']:
          current_contest['drawings_count'] = len(data_rows)
      for row in data_rows:
        current_row = dict(row)
        current_statistics = {}
        if current_row.get('mints_count') :
          current_statistics['mints_count'] = current_row['mints_count']
        if current_row.get('uuid') :
          current_statistics['uuid'] = current_row['uuid']
        if current_row.get('drawing_title'):
          current_statistics['drawing_title'] = current_row['drawing_title']
        # ordered by number of mints, then by drawing id
        current_contest['mints_statistics'].append(current_statistics)
      contests.append(current_contest)
    else :
      for row in data_rows:   
        row_dict = dict(row)
        print(f"ROW DICT {row_dict}")
        # id, created_by, title, description, active_from, active_to, minting_active, minting_price, created_at 
        current_contest = {}
        current_contest['id'] = row_dict['id']
        current_contest['created_by'] = row_dict['created_by']
        current_contest['title'] = row_dict['title']
        current_contest['description'] = row_dict['description']
        current_contest['active_from'] = row_dict['active_from']
        current_contest['active_to'] = row_dict['active_to']
        current_contest['minting_active'] = row_dict['minting_active']
        current_contest['minting_price'] = row_dict['minting_price']
        current_contest['created_at'] = row_dict['created_at']
        current_contest['drawings_count'] = 0
        if row_dict.get('drawings_count') :
          current_contest['drawings_count'] = row_dict['drawings_count']
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
    case "completed": 
      return "get_completed_contests" 
    case "incompleted":
      return 'get_incompleted_contests' # active and future
    
def get_contests_data(query_args):
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
  timestamp = 0 # default value
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
      else:
        # single contest query request
        # ['contests', {contest_id}] 
        query_type = 'get_contest_by_id'

            
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
    active_from = contest_data['active_from']
    active_to = contest_data['active_to']
    minting_active = contest_data['minting_active'] 
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