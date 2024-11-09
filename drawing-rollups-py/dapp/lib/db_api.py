import sqlite3 
import logging
import json   
from datetime import datetime

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'  
limit = 8
# helpers - move to utils.py
def get_query_offset(page):
  """ Calculates the OFFSET parameter in query statements.
  Parameters
  ----------
  page : string 
    
  Raises
  ------
  Returns
  -------
    offset: number
  """
  offset = 0
  if page:
    if page > 0:
      offset = (page -1) * limit 
  return offset

def get_closed_at(now, end):
  # hours * min * s
  seconds_period = int(end)*60*60
  closed_at = seconds_period + now
  logger.info(f"Expires at {datetime.fromtimestamp(closed_at)}")
  return closed_at
    
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
        print("get_all_drawings") 
        offset = get_query_offset(page)  
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.private, d.title, d.description, d.minting_price, d.closed_at, d.last_updated, "
        statement = statement + "count(*) OVER() AS total_rows " 
        statement = statement + "FROM drawings d "
        statement = statement + "ORDER BY d.last_updated DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [limit, offset]) 
        rows = cursor.fetchall() 
        return rows

      case "get_drawings_by_owner":
        logger.info(f"get_drawings_by_owner {query_args[2]}")
        owner = query_args[2] 
        offset = get_query_offset(page) 
        # get all drawings where I am the owner(the first painter) or where(I am a contributor and not the owner) 
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.private, d.title, d.description, d.minting_price, d.closed_at, d.last_updated, "
        statement = statement + "(select COUNT(DISTINCT d.uuid) from layers l INNER JOIN drawings d on l.drawing_id = d.id WHERE (d.owner LIKE ?) "
        statement = statement + "OR (l.painter LIKE ? AND d.owner NOT LIKE ?)) as total_rows " 
        statement = statement + "FROM layers l INNER JOIN drawings d on l.drawing_id = d.id WHERE d.last_updated in (SELECT max(last_updated) FROM drawings GROUP BY uuid )"
        statement = statement + "AND d.owner LIKE ? OR (l.painter LIKE ? AND d.owner NOT LIKE ?) GROUP BY d.uuid ORDER BY d.last_updated DESC LIMIT ? OFFSET ?"
        
        cursor.execute(statement, [owner, owner, owner, owner, owner, owner, limit, offset]) 
        rows = cursor.fetchall()
        logger.info(f"get MINE drawings ROWS {rows}")
        return rows
      
      case "get_drawing_by_uuid":
        logger.info(f"get_drawing_by_uuid {query_args[2]}")
        statement = "SELECT id, uuid, owner, dimensions, private, title, description, minting_price, closed_at "
        statement = statement + "FROM drawings WHERE uuid LIKE ? ORDER BY id DESC LIMIT 1"  
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
      
      case "get_drawings_by_uuid":
        uuids = json.loads(query_args[2])
        statement = "SELECT id, uuid, owner, dimensions, private, title, description, minting_price, closed_at, last_updated "
        statement = statement + "FROM drawings WHERE uuid IN (" + ",".join(["?"] * len(uuids)) + ")"   
        cursor.execute(statement, uuids)
        rows = cursor.fetchall() 
        logger.info(f"ROWS BY UUID {rows}")
        return rows

      case "get_drawing_by_ids": 
        logger.info(f"get drawing data where id in array: {query_args}") 
        log = json.loads(query_args) 
        
        statement = "SELECT drawing_objects, painter FROM drawings WHERE id IN(" + ",".join(["?"] * len(log)) + ")"   
        cursor.execute(statement, log)
        rows = cursor.fetchall() 
        return rows
      
      case "get_drawing_layers": 
        logger.info(f"get drawing layers {query_args}")  
        
        statement = "SELECT painter, drawing_objects, dimensions FROM layers WHERE drawing_id = ?"   
        cursor.execute(statement, [query_args])
        rows = cursor.fetchall() 
        logger.info(f"get MINE drawings ROWS {rows}")
        return rows
      
      case 'get_drawing_contributors':
        logger.info(f"get drawing contributors {query_args}")  
        
        statement = "SELECT DISTINCT(l.painter) FROM layers l LEFT JOIN drawings d "
        statement = statement + " on l.drawing_id = d.id WHERE d.uuid = ?"   
        
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
      # d.uuid, d.owner, d.dimensions, d.private, d.title, d.description, d.minting_price, d.closed_at
      current_drawing = {}
      current_drawing['uuid'] = row['uuid']
      current_drawing['owner'] = row['owner']
      current_drawing['dimensions'] = row['dimensions']
      current_drawing['private'] = row['private']
      current_drawing['title'] = row['title']
      current_drawing['description'] = row['description']
      current_drawing['minting_price'] = row['minting_price']
      current_drawing['closed_at'] = row['closed_at']

      current_drawing['update_log'] = get_drawing_layers(row['id']) 
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
  """ Entry function for retrieving drawing adata.
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
        private = 0
        if data['userInputData']['private'] == True:
          private= 1
        title = data['userInputData']['title']
        description = data['userInputData']['description']
        minting_price = data['userInputData']['mintingPrice'] 
        open = data['userInputData']['open'] # in hours
        #
        timestamp = query_args['timestamp']
        created_at = timestamp
        closed_at = get_closed_at(timestamp, open) 
        last_updated = timestamp
        cursor.execute(
            """
            INSERT INTO drawings(uuid, owner, dimensions, private, title, description, minting_price, created_at, closed_at, last_updated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (uuid, owner, dimensions, private, title, description, minting_price, created_at, closed_at, last_updated),
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
