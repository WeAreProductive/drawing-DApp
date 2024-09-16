import sqlite3 
import logging
import json
import time

# @TODO document functions python way
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = '../drawing.db' #@TODO check Docker statements for creating db
offset = 15 

def get_raw_data(type, query_args):
  # query args = {
  # offset
  # limit
  # owner
  # uuid
  # }
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
        # @TODO LIMIT 1
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
          # @TODO or get all data where id in array

          print("get drawing data where id in array")

  except Exception as e: 
    msg = f"Error executing insert statement: {e}" 
    logger.info(f"{msg}")

  finally:
    if conn:
      conn.close()

def get_all_drawings(query_args):
  # gets offset rows of drawings
  data_rows = get_raw_data('get_all_drawings', query_args)
  # for each row.log item call get_drawing_data
  # from each result get drawing_objects and add it to update_log array
  # each result item will consist of 
  # # row.uuid, row.owner, row.dimensions, row.date_created, row.action(?), row.update_log
  # compress with compressed = zlib.compress(bytes(json.dumps(drawing_input), "utf-8")) 
  # return array of drawings + current page + has next + has previous 
  return data_rows
  
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

def get_drawing_by_ids(query_args):
  data_rows= get_raw_data('get_drawing_by_ids', query_args)
  return 'drawing rows for array of ids'

def get_data(query_str):
    query_args = query_str.split('/')  
    # available endpoints 
    # array of drawings response
    # /drawings (page=1) query_args: [drawings]
    # /drawings/page/33 (page=33) query_args: [drawings, page, 33]
    # /drawings/owner/{address} (page=1) query_args: [drawings, owner, {address}]
    # /drawings/owner/{address}/page/33 (page=33) query_args: [drawings, owner, {address}, page, 33]
    # single drawing response
    # /drawing/uuid/{uuid}/owner/{address} query_args: [drawing, uuid, {uuid}, owner, {address}]

    # decide which get-data handler to use
    print(query_args[0])
    if query_args[0] == 'drawings':
      if 'owner' in query_args:
        get_drawings_by_owner(query_args)
      else:
        get_all_drawings(query_args)
    elif query_args[0] == 'drawing':
      get_drawing_by_uuid(query_args) 

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
   
  

