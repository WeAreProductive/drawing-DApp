import sqlite3 
import logging
import json  
import time
from datetime import datetime, timedelta  

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'  
limit = 3
drawing_is_enabled = 7 # days
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

def get_expires_at(now):
  # days * hours * min *s
  seconds_period = drawing_is_enabled*24*60*60
  expires_at = seconds_period + now
  logger.info(f"Expires at {datetime.fromtimestamp(expires_at)}")
  return expires_at
    
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
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.private, d.title, d.description, d.minting_price, d.expires_at, "
        statement = statement + "count(*) OVER() AS total_rows " 
        statement = statement + "FROM drawings d "
        statement = statement + "ORDER BY d.id DESC LIMIT ? OFFSET ?"
        logger.info(f"LIMIT {limit}")
        logger.info(f"Statement {offset}")
        cursor.execute(statement, [limit, offset]) 
        rows = cursor.fetchall() 
        return rows

      case "get_drawings_by_owner":
        logger.info(f"get_drawings_by_owner {query_args[2]}")
        owner = query_args[2] 
        offset = get_query_offset(page) 
        statement = "SELECT d.id, d.uuid, d.owner, d.dimensions, d.private, d.title, d.description, d.minting_price, d.expires_at, "
        statement = statement + "(select COUNT(DISTINCT d.uuid) from layers l INNER JOIN drawings d on l.drawing_id = d.id WHERE d.owner LIKE ? OR (l.painter LIKE ? AND d.owner NOT LIKE ?)) as total_rows " 
        statement = statement + "FROM layers l INNER JOIN drawings d on l.drawing_id = d.id WHERE l.drawing_id in (SELECT max(id) FROM drawings GROUP BY uuid )"
        statement = statement + "AND d.owner LIKE ? OR (l.painter LIKE ? AND d.owner NOT LIKE ?) ORDER BY d.id DESC LIMIT ? OFFSET ?"
        cursor.execute(statement, [owner, owner, owner, owner, owner, owner, limit, offset]) 
        rows = cursor.fetchall()
        logger.info(f"get MINE drawings ROWS {rows}")
        return rows
      
      case "get_drawing_by_uuid":
        logger.info(f"get_drawing_by_uuid {query_args[2]}")
        statement = "SELECT id, uuid, owner, dimensions, private, title, description, minting_price, expires_at "
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
        statement = "SELECT * FROM drawings WHERE uuid IN (" + ",".join(["?"] * len(uuids)) + ") AND id in (SELECT max(id) FROM drawings GROUP BY uuid )"   
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


  except Exception as e: 
    msg = f"Error executing statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()


def get_drawing_layers(id) :
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

    # d.uuid, d.owner, d.dimensions, d.private, d.title, d.description, d.minting_price, d.expires_at
      logger.info(f" Drawing row {row}")
      current_drawing = {}
      current_drawing['uuid'] = row['uuid']
      current_drawing['owner'] = row['owner']
      current_drawing['dimensions'] = row['dimensions'] #@TODO json parse maybe
      current_drawing['private'] = row['private']
      current_drawing['title'] = row['title']
      current_drawing['description'] = row['description']
      current_drawing['minting_price'] = row['minting_price']
      current_drawing['expires_at'] = row['expires_at']

      current_drawing['update_log'] = get_drawing_layers(row['id']) 
      drawings.append(current_drawing) 
  logger.info(f"Drawings {drawings}")
  if type != 'get_drawing_by_uuid' :
    has_next = False
    next_page = 0
    number_of_rows = row['total_rows']
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

# Obsolete @TODO remove after check
def get_drawings_by_ids(log):
  """ Retrieves each drawing's layers
  Parameters
  ----------
  log : list
    PK of each row in drawings table. Each row represents a drawing layer. 
  Raises
  ------
  Returns
  -------
    list : drawings layers data
  """
  drawing_slices = [] 
  data_rows = get_raw_data(log, 'get_drawing_by_ids') 
  if data_rows:
    # from each result get drawing_objects and add it to update_log/drawing_slices array 
    for row in data_rows:
      drawing_slices.append(row)
  return drawing_slices

def get_data(query_str):
  query_args = query_str.split('/')
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
      # @TODO count for has next will depend on grouped uuid
      query_type = 'get_all_drawings' 
      page = int(query_args[2])
  elif query_args[0] == 'drawing':
    if 'uuid' in query_args:
      query_type = 'get_drawing_by_uuid'

  drawings = get_drawings(query_args, query_type, page) 
  return drawings

def create_drawing(data): 
  """ Executes database insert query statement.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  Raises
  ------
    Exception 
      If error arises while execiting the database statement.
  Returns
  -------
    id: int
    The PK of the row created.
  """ 
  uuid = data['uuid']
  owner = data['owner']
  dimensions = json.dumps(data['dimensions']) 
  # @TODO timezones?
  now = int( time.time() )
  logger.info(f"Now {now}")
  created_at = now
  expires_at = get_expires_at(now) 
 
  logger.info(f"Private {data['userInputData']['private']}")
  # user input data
  private = 0
  if data['userInputData']['private'] == True:
    private= 1
  title = data['userInputData']['title']
  description = data['userInputData']['description']
  minting_price = data['userInputData']['mintingPrice'] 
  logger.info(f"OWNER {type(owner)}")
  logger.info(f"UUID {type(uuid)}")
  try: 
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor() 
   
    cursor.execute(
        """
        INSERT INTO drawings(uuid, owner, dimensions, private, title, description, minting_price, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (uuid, owner, dimensions, private, title, description, minting_price, created_at, expires_at),
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
def store_drawing_layer(id, sender, data):
  parsed_drawing = json.loads(data['drawing'])
  content = json.dumps(parsed_drawing['content'])
  dimensions = json.dumps(data['dimensions'])
    # drawing_input["drawing_objects"] = content
  try: 
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor() 
    
    cursor.execute(
        """
        INSERT INTO layers(painter, drawing_objects, dimensions, drawing_id)
        VALUES (?, ?, ?, ?)
        """,
        (sender, content, dimensions, id),
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

def store_data(cmd, sender, data): 
  """ Routes dra.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement. 
  Raises
  ------
    Exception 
      If error arises while execiting the database statement.
  Returns
  -------
    id : int
    The PK of the row updated.
  """
  # prepare data
  
  if cmd == 'cn' : 
    logger.info(f"Create drawing") 
    id = create_drawing(data)
    
  elif cmd == 'un' :
    logger.info(f"Update drawing") 
    uuid = data['uuid']
    row = get_raw_data(uuid, 'get_drawing_id')
    logger.info(f"ID {row['id']}")
    id = row['id']
  
  store_drawing_layer(id, sender, data)

  # conn = None
  # id = insert_drawing_data(query_args)
  # log1 = get_drawing_log(query_args['uuid'])
  # logger.info(f"LOG 1 {log1}")
  # if id : 
  #   logTuple = get_drawing_log(query_args['uuid'])
  #   logger.info(f"LOG 1 {logTuple[0]}")
    
  #   if logTuple:
  #     log = logTuple[0]
  #     logger.info(f"TYPE {type(log)}")
  #     logParsed = json.loads(log)
  #     logger.info(f"TYPE @ {logParsed}")
  #     drawing_log = json.loads(log)
  #   else:
  #     drawing_log = [] 
    
  #   drawing_log.append(id) 
  #   json_log = json.dumps(drawing_log) 
  #   try:

  #     conn = sqlite3.connect(db_filename)
  #     cursor = conn.cursor()
      
  #     cursor.execute(
  #       """
  #       UPDATE drawings
  #       SET log = ?
  #       WHERE id = ?
  #       """,
  #       (json_log, id),
  #     )
  #     conn.commit()
  #     id = cursor.lastrowid
  #     return id

  #   except Exception as e: 
  #     msg = f"Error executing insert statement: {e}" 
  #     logger.info(f"{msg}")
  #   finally:
  #     if conn:
  #       conn.close()
   
  

