import sqlite3 
import logging
import json
import zlib

# @TODO document functions python way
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = '../drawing.db' #@TODO check Docker statements for creating db
offset = 15 

# query args = {
# offset
# limit
# owner
# uuid
# }

def get_raw_data(type, query_args):
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

        print("get_drawings_by_owner")

        cursor.execute(
          """
          SELECT * FROM drawings
          WHERE owner = ?
          """,
          (query_args['owner']),
        )

        rows = cursor.fetchall()
        return rows

      case "get_drawing_by_uuid":

        print("get_drawing_by_uuid_and_owner") 

        cursor.execute(
          """
          SELECT * FROM drawings
          WHERE uuid = ?
          AND owner = ?
          LIMIT 1
          """,
          (query_args['owner'], query_args['uuid']),
        )
        rows = cursor.fetchall() #@TODO fetch single row
        return rows

      case "get_drawing_by_ids":

          logger.info(f"get drawing data where id in array: {query_args}")
          cursor.execute(
            """
            SELECT * FROM drawings
            WHERE id IN(?)
            """,
            (query_args['ids']),
          )
          rows = cursor.fetchall() 
          return rows


  except Exception as e: 
    msg = f"Error executing insert statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()

def get_all_drawings(query_args):
  drawings = [] # all drawings array result
  # gets offset rows of drawings
  data_rows = get_raw_data('get_all_drawings', query_args)
  
  # format drawings data as row.uuid, row.owner, row.dimensions, row.date_created, row.action(?), row.update_log, row.log
  for row in data_rows: 
    logger.info(f"row: {row}")
    current_drawing = {}
    current_drawing['uuid'] = row[1]
    current_drawing['dimensions'] = row[2]
    # current_drawing.date_created = row[3]
    current_drawing['owner'] = row[4]
    # current_drawing.action = row[5]
    current_drawing['log'] = row[7]
    # for row.log item call get_drawing_by_ids
    # from each result get drawing_objects and add it to update_log array
    current_drawing['update_log'] = get_drawing_by_ids(current_drawing['log'])
    
    logger.info(f"Current drawing: {current_drawing} ")
    # compressed =  zlib.compress(bytes(json.dumps(current_drawing), "utf-8")) 
    drawings.append(current_drawing)
  # compress with compressed = zlib.compress(bytes(json.dumps(drawing_input), "utf-8")) 
  # return array of drawings + current page + has next + has previous @TODO
  return drawings
  
def get_drawings_by_owner(query_args):
  # gets offset rows of drawings
  data_rows = get_raw_data('get_drawings_by_owner', query_args)
  # for each row.log item call get_drawing_data
  # from each result get drawing_objects and add it to update_log array
  # each result item will consist of 
  # # row.uuid, row.owner, row.dimensions, row.date_created, row.action(?), row.update_log

  # compress with compressed = zlib.compress(bytes(json.dumps(drawing_input), "utf-8")) 
  # return array of drawings + current page + has next + has previous 

  return 'all drawings for '

#@TODO add owner for this request
def get_drawing_by_uuid(query_args): 
  # gets single drawing row
  print('get_drawing_by_uuid')
  data_row = get_raw_data('get_drawing_by_uuid', query_args)
  # forthe row.log item call get_drawing_data
  # from each result get drawing_objects and add it to update_log array
 
  # the result item will consist of 
  # # row.uuid, row.owner, row.dimensions, row.date_created, row.action(?), row.update_log
  #  # compress with compressed = zlib.compress(bytes(json.dumps(drawing_input), "utf-8")) 
  # returns single drawing object
      
  return 'single drawing for a given uuid'

def get_drawing_by_ids(log):
  drawing_slices = []
  parsed_log = json.loads(log)
  string_log = ', '.join(map(str, parsed_log)) 
  query_args = {'ids': string_log}

  data_rows = get_raw_data('get_drawing_by_ids', query_args)
  # from each result get drawing_objects and add it to update_log/drawing_slices array 
  for row in data_rows:
    drawing_slices.append(row[6])
  return drawing_slices

  # available endpoints 
  # array of drawings response
  # /drawings (page=1) query_args: [drawings]
  # /drawings/page/33 (page=33) query_args: [drawings, page, 33]
  # /drawings/owner/{address} (page=1) query_args: [drawings, owner, {address}]
  # /drawings/owner/{address}/page/33 (page=33) query_args: [drawings, owner, {address}, page, 33]
  # single drawing response
  # /drawing/uuid/{uuid}/owner/{address} query_args: [drawing, uuid, {uuid}, owner, {address}]
def get_data(query_str):
    query_args = query_str.split('/')  

    # decide which get-data handler to use
    logger.info(f"Router received query args: {query_args}")

    if query_args[0] == 'drawings':
      if 'owner' in query_args:
        drawings = get_drawings_by_owner(query_args)
      else:
        drawings = get_all_drawings(query_args)
    elif query_args[0] == 'drawing':
      drawings = get_drawing_by_uuid(query_args)
    return drawings 

def insert_drawing_data(query_args):

  uuid = query_args['uuid'] 
  dimensions = json.dumps(query_args['dimensions'])
  update_log = query_args['update_log']
  date_created = update_log[0]['date_updated'] #@TODO change last_updated to date_created
  owner = update_log[0]['painter'] #@TODO change painter to owner
  action = update_log[0]['action']
  drawing_objects = json.dumps(update_log[0]['drawing_objects']) 


  try:
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()
    json_log = json.dumps(query_args['log'])
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
    log.append(id) 

    try:

      conn = sqlite3.connect(db_filename)
      cursor = conn.cursor()
      json_log = json.dumps(log)
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
   
  

