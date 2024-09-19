import sqlite3 
import logging
import json
import zlib

# @TODO document functions python way 
# @TODO query binding
# @TODO paginate results

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'  
offset = 15  

def get_raw_data(query_args, type):
  conn = None
  try :
    conn = sqlite3.connect(db_filename) 
    cursor = conn.cursor()
    match type:
      case "get_all_drawings": 
          print("get_all_drawings") 
          cursor.execute(
              """
              SELECT * FROM drawings
              """,
              (),
            )
          rows = cursor.fetchall()
          return rows

      case "get_drawings_by_owner":
        logger.info(f"get_drawings_by_owner {query_args[2]}")
        statement = "SELECT * FROM drawings WHERE owner LIKE '%" + query_args[2] +"%'"
        cursor.execute(statement)

        rows = cursor.fetchall()
        return rows

      case "get_drawings_by_uuid":
        uuids = json.loads(query_args[2])
        string_uuids = '", "'.join(map(str,uuids))  
        logger.info(f"get_drawings_by_uuids {string_uuids}") 
        statement = 'SELECT * FROM drawings WHERE uuid IN("' + string_uuids + '")'
        logger.info(statement)
        # cursor.execute(
        #   """
        #   SELECT * FROM drawings
        #   WHERE uuid = ?
        #   AND owner = ?
        #   LIMIT 1
        #   """,
        #   (query_args['owner'], query_args['uuid']),
        # )
        cursor.execute(statement)
        rows = cursor.fetchall() #@TODO fetch single row
        return rows

      case "get_drawing_by_ids": 
          logger.info(f"get drawing data where id in array: {query_args}") 
          statement = "SELECT drawing_objects FROM drawings WHERE id IN(" + query_args +")" 
          # @TODO how to correctly bind WHERE IN clause
          # cursor.execute(
          #   """
          #   SELECT * FROM drawings
          #   WHERE id IN(?)
          #   """,
          #   (args),
          # )
          cursor.execute(statement)
          rows = cursor.fetchall() 
          return rows


  except Exception as e: 
    msg = f"Error executing statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()

def get_drawings(query_args, type):
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
  drawing_slices = []
  parsed_log = json.loads(log)
  string_log = ', '.join(map(str, parsed_log)) 

  data_rows = get_raw_data(string_log, 'get_drawing_by_ids')
  if data_rows:
    # from each result get drawing_objects and add it to update_log/drawing_slices array 
    for row in data_rows:
      drawing_slices.append(row[0])
  return drawing_slices

def get_data(query_str):
  query_args = query_str.split('/')  
  # decide which get-data handler to use 
  if query_args[0] == 'drawings':
    if 'owner' in query_args:
      query_type = 'get_drawings_by_owner'
    elif 'uuids' in query_args:
      query_type = 'get_drawings_by_uuid'
    else:
      query_type = 'get_all_drawings'
  drawings = get_drawings(query_args, query_type) 
  return drawings

def insert_drawing_data(query_args):
  # @TODO waiting for 
  # uuid 
  # dimensions 
  # owner
  # log 
  # drawing_objects - last drawing layer
  # action

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
    # else:
      # json_log = log
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
  conn = None
  # for key, value in query_args.items() :
  #   print(key)
  #   print(value)
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
   
  

