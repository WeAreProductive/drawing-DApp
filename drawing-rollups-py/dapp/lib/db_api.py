import sqlite3 
import logging
import json 

# @TODO paginate results

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'  
limit = 6
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
  
    
def get_raw_data(query_args, type):
  """ Executes database query statement.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  type : str
    The query type to execute
    
  Raises
  ------
    Exception 
      If error arises while execiting the database statement.
  Returns
  -------
    list : drawings data
  """
  conn = None
  #  ['drawings', 'owner', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 'page', '1']
  page = 1

  if len(query_args) > 3:
    page = int(query_args[4])
  try :
    conn = sqlite3.connect(db_filename) 
    cursor = conn.cursor()
    match type:
      case "get_all_drawings": 
          print("get_all_drawings") 
          offset = get_query_offset(page) 
          cursor.execute(
              """
              SELECT * FROM drawings ORDER BY id DESC LIMIT ? OFFSET ?
              """,
              (limit, offset),
            )
          rows = cursor.fetchall()
          return rows

      case "get_drawings_by_owner":
        logger.info(f"get_drawings_by_owner {query_args[2]}")
        owner = query_args[2] 
        offset = get_query_offset(page) 
        statement = "SELECT * FROM drawings WHERE owner LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?"  
        cursor.execute(statement, [owner, limit, offset]) 
        rows = cursor.fetchall()
        return rows
      
      case "get_drawing_by_uuid":
        logger.info(f"get_drawing_by_uuid {query_args[2]}")
        statement = "SELECT * FROM drawings WHERE uuid LIKE ? LIMIT 1"  
        cursor.execute(statement, [query_args[2]]) 
        rows = cursor.fetchall()
        return rows

      case "get_drawings_by_uuid":
        uuids = json.loads(query_args[2])
        statement = "SELECT * FROM drawings WHERE uuid IN (" + ",".join(["?"] * len(uuids)) + ")"   
        cursor.execute(statement, uuids)
        rows = cursor.fetchall() 
        return rows

      case "get_drawing_by_ids": 
          logger.info(f"get drawing data where id in array: {query_args}") 
          log = query_args
          statement = "SELECT drawing_objects FROM drawings WHERE id IN(" + ",".join(["?"] * len(log)) + ")"  
          cursor.execute(statement, log)
          rows = cursor.fetchall() 
          return rows


  except Exception as e: 
    msg = f"Error executing statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()

def get_drawings(query_args, type):
  """ Retrieves requested drawings data.
  Parameters
  ----------
  query_args : list
    Parameters to be bind in the query statement.
  type : str
    The query type to execute
    
  Raises
  ------
  Returns
  -------
    list : drawings data, 'get_drawing_by_uuid' type returns list with 1 element
  """
  drawings = [] # all drawings array result 
  data_rows = get_raw_data(query_args, type) 
  if data_rows:
    # format drawings data as row.uuid, row.owner, row.dimensions, row.date_created, row.action(?), row.update_log, row.log
    for row in data_rows:  
      current_drawing = {}
      current_drawing['uuid'] = row[1]
      current_drawing['dimensions'] = row[2] 
      current_drawing['owner'] = row[4] 
      current_drawing['log'] = row[7]
      # for row.log item call get_drawing_by_ids
      # from each result get drawing_objects and add it to update_log array
      current_drawing['update_log'] = get_drawings_by_ids(current_drawing['log'])  
      drawings.append(current_drawing) 
    # return array of drawings + current page + has next + has previous @TODO
  return drawings

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
      drawing_slices.append(row[0])
  return drawing_slices

def get_data(query_str):
  query_args = query_str.split('/')  
  logger.info(f"query args as list {query_args}")
  #  ['drawings', 'owner', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 'page', '1']
  # decide which get-data handler to use 
  if query_args[0] == 'drawings':
    if 'owner' in query_args:
       # paginated, expects 5 elements in query_args
      query_type = 'get_drawings_by_owner'
    elif 'uuids' in query_args:
      query_type = 'get_drawings_by_uuid'
    else:
      # paginated, expects 5 elements in query_args
      query_type = 'get_all_drawings' 
  elif query_args[0] == 'drawing':
    if 'uuid' in query_args:
      query_type = 'get_drawing_by_uuid'
  drawings = get_drawings(query_args, query_type) 
  return drawings

def insert_drawing_data(query_args): 
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
  logger.info(f"Insert {query_args}")
  uuid = query_args['uuid'] 
  owner = query_args['owner']  
  date_created = query_args['date_created']
  action = query_args['action']
  dimensions = json.dumps(query_args['dimensions']) 
  drawing_objects = json.dumps(query_args['drawing_objects'])    
  try:
    logger.info(f"query args log 1 - {query_args['log']}")
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()
    log = query_args['log'] # string 
    
    json_log = json.dumps(log)
    logger.info(f"json_log 2 - {json_log}")
   
    cursor.execute(
        """
        INSERT INTO drawings(uuid, dimensions, date_created, owner, action, drawing_objects, log)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (uuid, dimensions, date_created, owner, action, drawing_objects, json_log),
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

def store_data(query_args): 
  """ Executes database UPDATE query statement.
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
  conn = None
  id = insert_drawing_data(query_args)
  
  if id : 
    log = query_args['log']
    logger.info(f"log 3 - {log}")
    if log:
      drawing_log = json.loads(log)
      logger.info(f"drawing log 4 - {drawing_log}")
    else:
      drawing_log = []
      logger.info(f"drawing log 5 - {drawing_log}")
    
    drawing_log.append(id)
    logger.info(f"drawing log 6 - {drawing_log}")
    json_log = json.dumps(drawing_log)
    logger.info(f"drawing log 7 - {json_log}") 
    try:

      conn = sqlite3.connect(db_filename)
      cursor = conn.cursor()
      
      cursor.execute(
        """
        UPDATE drawings
        SET log = ?
        WHERE id = ?
        """,
        (json_log, id),
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
   
  

