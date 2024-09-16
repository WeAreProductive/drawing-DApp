import sqlite3 
import logging
import json
import time

# @TODO document functions python way
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = '../drawing.db' #@TODO check Docker statements for creating db

def get_data(query_args):
    print(query_args)
    # prepare statement
    # execute statement
    """ create a database connection to an SQLite database """
    conn = None
    try:
      conn = sqlite3.connect(db_filename)
      cursor = conn.cursor()
      
      cursor.execute(
        """
        SELECT * FROM drawings
        """,
        (),
      )

      rows = cursor.fetchall()
      #@TODO handle data based on type
      return json.dumps(rows)
      # logger.info(f"Drawings table data {rows}")

    except Exception as e: 
      msg = f"Error executing insert statement: {e}" 
      logger.info(f"{msg}")

    finally:
      if conn:
        conn.close()

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
   
  

