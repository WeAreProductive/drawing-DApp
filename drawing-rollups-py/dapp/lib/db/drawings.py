import sqlite3 
import logging
import json    
from config import *

from lib.db.utils import get_closed_at, get_query_offset

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__) 
    
def get_raw_data(query_args, type, page = 1):
  """ Executes database query statement.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  type : str
    The query type to execute
  page : integer
    Result offset
  Raises
  ------
    Exception 
      If error arises while execiting the database statement.
  Returns
  -------
    list : drawings data
  """
  conn = None 
  try :
    conn = sqlite3.connect(db_filename) 
    conn.row_factory = sqlite3.Row # receive named results
    cursor = conn.cursor() 
    match type:
      case "get_all_drawings": 
        logger.info("get_all_drawings") 
        offset = get_query_offset(page)  
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.is_private, d.title, d.description, d.minting_price, d.closed_at, d.last_updated, "
        statement = statement + "c.id as contest_id, c.title as contest_title, " 
        statement = statement + "count(*) OVER() AS total_rows " 
        statement = statement + "FROM drawings d "
        statement = statement + "LEFT JOIN contests c "
        statement = statement + "ON d.contest_id = c.id  "
        statement = statement + "ORDER BY d.last_updated DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [limit, offset]) 
        rows = cursor.fetchall() 
        return rows

      case "get_drawings_by_owner":
        logger.info(f"get_drawings_by_owner {query_args[2]}")
        owner = query_args[2] 
        offset = get_query_offset(page) 
        # get all drawings where I am the owner(the first painter) or where(I am a contributor and not the owner) 
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.is_private, d.title, d.description, d.minting_price, d.closed_at, d.last_updated, "
        statement = statement + "c.id as contest_id, c.title as contest_title, "
        statement = statement + "(select COUNT(DISTINCT d.uuid) from layers l INNER JOIN drawings d on l.drawing_id = d.id WHERE (d.owner LIKE ?) "
        statement = statement + "OR (l.painter LIKE ? AND d.owner NOT LIKE ?)) as total_rows " 
        statement = statement + "FROM layers l INNER JOIN drawings d on l.drawing_id = d.id "
        statement = statement + "LEFT JOIN contests c "
        statement = statement + "ON d.contest_id = c.id "
        statement = statement + "WHERE d.last_updated in (SELECT max(last_updated) FROM drawings GROUP BY uuid )"
        statement = statement + "AND d.owner LIKE ? OR (l.painter LIKE ? AND d.owner NOT LIKE ?) GROUP BY d.uuid ORDER BY d.last_updated DESC LIMIT ? OFFSET ?"
        
        cursor.execute(statement, [owner, owner, owner, owner, owner, owner, limit, offset]) 
        rows = cursor.fetchall()
        return rows
      
      case "get_drawing_by_uuid":
        logger.info(f"get_drawing_by_uuid {query_args[2]}")
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.is_private, d.title, d.description, d.minting_price, d.closed_at, "
        statement = statement + "c.id as contest_id, (c.active_to + c.minting_active * 3600) as minting_closed_at, c.title as contest_title, c.winner "
        statement = statement + "FROM drawings d "  
        statement = statement + "LEFT JOIN contests c "  
        statement = statement + "ON d.contest_id = c.id "  
        statement = statement + "WHERE d.uuid LIKE ? "  
        statement = statement + "GROUP BY d.id "  
        statement = statement + "ORDER BY d.id DESC LIMIT 1"  
        cursor.execute(statement, [query_args[2]]) 
        rows = cursor.fetchall() 
        return rows
      
      case "get_drawing_id":
        logger.info(f"get_drawing_id {query_args}")
        statement = "SELECT id "
        statement = statement + "FROM drawings WHERE uuid LIKE ? LIMIT 1"  
        cursor.execute(statement, [query_args]) 
        row = cursor.fetchone() 
        return row
      
      case "get_drawings_by_uuid": # voucher images
        uuids = json.loads(query_args[2])
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.is_private, d.title, d.description, d.minting_price, d.closed_at, d.last_updated, "
        statement = statement + "c.id as contest_id, c.title as contest_title "   
        statement = statement + "FROM drawings d "   
        statement = statement + "LEFT JOIN contests c "   
        statement = statement + "ON d.contest_id = c.id "   
        statement = statement + "WHERE d.uuid IN (" + ",".join(["?"] * len(uuids)) + ") "   
        cursor.execute(statement, uuids)
        rows = cursor.fetchall() 
        logger.info(f"ROWS BY UUID {rows}")
        return rows

      case "get_drawings_by_ids": 
        logger.info(f"get drawing data where id in array: {query_args}") 
        # @TODO bind the statement
        statement = "SELECT "   
        statement = statement + "d.id as drawing_id, d.uuid, " # concat
        statement = statement + "COUNT(m.drawing_id) as mints_count, "
        statement = statement + "GROUP_CONCAT(m.minter, ',') AS drawing_minters, "
        statement = statement + "GROUP_CONCAT(l.painter, ',') AS drawing_contributors "
        # statement = statement + "m.minter " # count
        statement = statement + "FROM mints m " 
        statement = statement + "JOIN drawings d " 
        statement = statement + "ON m.drawing_id = d.uuid " 
        statement = statement + "JOIN layers l " 
        statement = statement + "ON l.drawing_id = d.id " 
        statement = statement + "WHERE d.id IN (" + query_args + ") " 
        statement = statement + "GROUP BY d.id "
        statement = statement + "ORDER BY mints_count DESC"  
        cursor.execute(statement)
        # cursor.execute(statement, [query_args])
        rows = cursor.fetchall() 
        return rows
      
      case "get_drawing_layers": 
        logger.info(f"get drawing layers {query_args}")  
        
        statement = "SELECT painter, drawing_objects, dimensions FROM layers WHERE drawing_id = ?"   
        cursor.execute(statement, [query_args])
        rows = cursor.fetchall() 
        return rows
      
      case 'get_drawing_contributors':
        logger.info(f"get drawing contributors {query_args}")  
        
        statement = "SELECT DISTINCT(l.painter) FROM layers l LEFT JOIN drawings d "
        statement = statement + " on l.drawing_id = d.id WHERE d.uuid = ?"     
        cursor.execute(statement, [query_args])
        rows = cursor.fetchall()   
        return rows
      case 'get_drawing_minters':
        logger.info(f"Get drawing minters :: drawing uuid {query_args}")
        statement = "SELECT minter FROM mints m "
        statement = statement + " WHERE m.drawing_id = ?"     
        cursor.execute(statement, [query_args])
        rows = cursor.fetchall()   
        return rows

  except Exception as e: 
    msg = f"Error executing statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()


def get_drawing_layers(id) :
  """ Retrieves the drawing layers """
  update_log = []
  data_rows = get_raw_data(id, 'get_drawing_layers')  
  if data_rows:
    for row in data_rows:  
      current_log = {}
      current_log['painter'] = row['painter']
      current_log['drawing_objects'] = row['drawing_objects']
      current_log['dimensions'] = row['dimensions']

      update_log.append(current_log)
  return update_log

def get_drawings(query_args, type, page):
  """ Retrieves requested drawings data.
      Serves data to inspect requests.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  type : str
    The query type to execute
  page : integer
    Result offset
  Raises
  ------
  Returns
  -------
    dictionary with
    has_next : boolean
    page : number
    drawings : list : drawings data, 'get_drawing_by_uuid' type returns list with 1 element
  """
  result = {}
  drawings = [] # all drawings array result 
  data_rows = get_raw_data(query_args, type, page) 
  
  if data_rows: 
    for row in data_rows:   
      # d.uuid, d.owner, d.dimensions, d.is_private, d.title, d.description, d.minting_price, d.closed_at
      row_dict = dict(row)
      current_drawing = {}
      current_drawing['uuid'] = row_dict['uuid']
      current_drawing['owner'] = row_dict['owner']
      current_drawing['dimensions'] = row_dict['dimensions'] 
      current_drawing['is_private'] = row_dict['is_private']
      current_drawing['title'] = row_dict['title']
      current_drawing['description'] = row_dict['description']
      current_drawing['minting_price'] = row_dict['minting_price']
      current_drawing['closed_at'] = row_dict['closed_at']
      # shape drawing contest data if any
      if row_dict.get('contest_id'):
        #
        drawing_contest = {}
        drawing_contest['id'] = row_dict['contest_id']
        drawing_contest['title'] = row_dict['contest_title']
        if row_dict.get('minting_closed_at'):
          drawing_contest['minting_closed_at'] = row_dict['minting_closed_at']
        if row_dict.get('winner'):
          drawing_contest['winner'] = row_dict['winner']
        minters = get_drawing_minters(row_dict['uuid'])
        drawing_contest['minters'] = minters
        ### add more data if the FE needs it
        current_drawing['contest'] = drawing_contest

      current_drawing['update_log'] = get_drawing_layers(row_dict['id']) 
      drawings.append(current_drawing)  
  
  if type == 'get_drawings_by_owner' or type == "get_all_drawings" :
    has_next = False
    next_page = 0
    
    if data_rows:
      number_of_rows = data_rows[0]['total_rows']
      # calculate up_to_now_loaded including the current set
      logger.info(f"Calculate number of rows ...")
      loaded = page * limit
      if loaded < int(number_of_rows): 
        has_next = True 
        next_page = page + 1 
   
    result['has_next'] = has_next
    result['next_page'] = next_page

  result['drawings'] = drawings 
    
  return result

def get_data(query_args):
  """ Entry function for retrieving drawing data 
      that will be served in the FE
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  Raises
  ------
  Returns
  -------
    list : drawings data
  """
  page = 1 # default value
  query_type = ''
  # decide which get-data handler to use 
  if query_args[0] == 'drawings':
    if 'owner' in query_args:
      # paginated, expects 5 elements in query_args
      # ['drawings', 'owner', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 'page', '1']
      query_type = 'get_drawings_by_owner'
      page = int(query_args[4])
    elif 'uuids' in query_args:
      query_type = 'get_drawings_by_uuid'
    else:
      # paginated, expects 3 elements in query_args
      # ['drawings', 'page', '1']
      query_type = 'get_all_drawings' 
      page = int(query_args[2])
  elif query_args[0] == 'drawing':
    if 'uuid' in query_args:
      query_type = 'get_drawing_by_uuid'

  drawings = get_drawings(query_args, query_type, page) 
  return drawings

def get_drawing_minting_price( uuid ):
  """ Drawing minting price getter
    Parameters
    ----------
    uuid : string
      Drawing uuid
    Raise
    ------
    Returns
    -------
      number/float: drawing minting price
    """
  drawing = get_raw_data(['', '', uuid], 'get_drawing_by_uuid')
  return drawing[0]['minting_price']

def get_drawing_contributors( uuid ):
  """ Get unique drawing contributor addresses
  Parameters
  ----------
  uuid : string
    Drawing uuid the contributors are retrieved
  Raises
  ------
  Returns
  -------
    list : contributor addresses
  """
  contributors = get_raw_data(uuid, 'get_drawing_contributors')
  return contributors
def check_is_contest_drawing(uuid):
  """ Check if the drawing belongs to a contest
   Parameters
  ----------
  uuid : string
    Drawing uuid
  Raises
  ------
  Returns
  -------
    boolean
  """
  drawings = get_raw_data(['', '', uuid], 'get_drawing_by_uuid')
  if drawings:
    drawing = dict(drawings[0])
    logger.info(f"DRAWING {drawing}")
    if drawing.get('contest_id'):
      logger.info(f"CONTEST DRAWING")
      return True # is acontest drawing
    else :
      logger.info(f"NOT CONTEST DRAWING")
      return False
def get_drawings_by_ids(drawings_ids):
  """ Gets drawings by ids to serve the contest manager
  
  """   
  args = drawings_ids.split(',')
  numbers = []
  for arg in args:
    numbers.append(int(arg))
  data = get_raw_data(drawings_ids, 'get_drawings_by_ids')
  return data
# @TODO replace uuid with id! 
# its wrong in the mints table must be ids saved not uuids!!
def get_drawing_minters(uuid):
  """ Retrieves minters for the given drawing
  Parameters
  ----------
  Raises
  ----------
  Returns
  ----------
  list: of minters addresses
  """
  minters = []
  minters_data = get_raw_data(uuid, 'get_drawing_minters')
  for data in minters_data:
    minter = dict(data)
    minters.append(minter['minter'])
  return minters

def save_data(type, query_args) :
  """ Executes database insert and update query statement.
  Parameters
  ----------
    type: string
      The type to select the query statement
    query_args: dict
      Query parameters to be bind in the query statement
  Raises
  ------
    Exception 
      If error arises while execiting the database statement.
  Returns
  -------
    id: int
    The PK of the row created.
    or void
  """ 
  try: 
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor() 

    match type:
      case "create_drawing": 
        # "data": data, "timestamp": timestamp}
        data = query_args['data']
        uuid = data['uuid']
        owner = data['owner']
        dimensions = json.dumps(data['dimensions']) 
        # user input data
        is_private = 0
        if data['userInputData']['is_private'] == True:
          is_private= 1
        title = data['userInputData']['title']
        description = data['userInputData']['description']
        minting_price = data['userInputData']['minting_price'] 
        open = data['userInputData']['open'] # in hours
        logger.info(f"OPEN {open}")
        # @TODO if there's a contest id - get this contest active_to and add it 
        # as drawing closed_at to avoid differences due to Math.floor in the FE
        contest_id = data['userInputData']['contest'] # 0 or number > 0
        #
        timestamp = query_args['timestamp']
        created_at = timestamp
        closed_at = get_closed_at(timestamp, open) 
        last_updated = timestamp
        cursor.execute(
            """
            INSERT INTO drawings(uuid, owner, dimensions, is_private, title, description, minting_price, created_at, closed_at, last_updated, contest_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (uuid, owner, dimensions, is_private, title, description, minting_price, created_at, closed_at, last_updated, contest_id),
        )

        conn.commit()
        id = cursor.lastrowid
        return id
      case "store_drawing_layer":
        # {"id": id, "sender": sender, "data": data, "timestamp": timestamp}
        data = query_args['data']
        parsed_drawing = json.loads(data['drawing'])
        content = json.dumps(parsed_drawing['content'])
        dimensions = json.dumps(data['dimensions']) 
        now = query_args['timestamp']
        sender = query_args['sender']
        id = query_args['id']

        cursor.execute(
          """
          INSERT INTO layers(painter, drawing_objects, dimensions, drawing_id)
          VALUES (?, ?, ?, ?)
          """,
          (sender, content, dimensions, id),
        )
        cursor.execute(
          """
            UPDATE drawings
            SET last_updated = ?
            WHERE
            id = ?
            LIMIT 1;
            """,
            (now, id),
        )

        conn.commit()
        id = cursor.lastrowid
        return id
      case "store_minting_voucher_data":
        # {"id":data, "sender": sender, "timestamp": timestamp}
        id = query_args['id'] 
        sender = query_args['sender']
        timestamp = query_args['timestamp']
        cursor.execute(
          """
          INSERT INTO mints(minter, created_at, drawing_id)
          VALUES (?, ?, ?)
          """,
          (sender, timestamp, id),
        )
        conn.commit()
        return

  except Exception as e: 
    msg = f"Error executing insert statement: {e}" 
    logger.info(f"{msg}")
  finally:
    if conn:
      conn.close()

def store_data(cmd, timestamp, sender, data): 
  """ Routes dra.
  Parameters
  ----------
  
  Raises
  ------
    Exception 
      If error arises while execiting the database statement.
  Returns
  -------
    void
  """
  # prepare data
  if cmd == 'cd' : 
    logger.info(f"Create drawing") 
    id = save_data('create_drawing',{"data": data, "timestamp": timestamp})
    save_data("store_drawing_layer", {"id": id, "sender": sender, "data": data, "timestamp": timestamp}) 
    logger.info(f"CREATE DRAWING DATA {data}")
    logger.info(f"CREATE DRAWING DATA ID {id}")
  elif cmd == 'ud' :
    logger.info(f"Update drawing") 
    uuid = data['uuid']
    row = get_raw_data(uuid, 'get_drawing_id')
    logger.info(f"ID {row['id']}")
    id = row['id']
    save_data("store_drawing_layer", {"id": id, "sender": sender, "data": data, "timestamp": timestamp}) 
  elif cmd == 'v-d-nft':
    logger.info(f"Store minting-voucher data") 
    save_data("store_minting_voucher_data", {"id":data, "sender": sender, "timestamp": timestamp}) 

