import sqlite3 
import logging
import json

# @TODO document functions python way
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = '../drawing.db' #@TODO check Docker statements for creating db

def get_data():
    print(type)
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

      logger.info(f"Received finish status {rows}")

    except Exception as e: 
      msg = f"Error executing insert statement: {e}" 
      logger.info(f"{msg}")

    finally:
      if conn:
        conn.close()
    
def store_data(query_args): 
  conn = None
  for key, value in query_args.items() :
    print(key)
    print(value)

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
    
    cursor.execute(
        """
        INSERT INTO drawings(uuid, dimensions, date_created, owner, action, drawing_objects)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (uuid, dimensions, date_created, owner, action, drawing_objects),
    )

    conn.commit()

    id = cursor.lastrowid
    logger.info(f"Last row id {id}") 

  except Exception as e: 
    msg = f"Error executing insert statement: {e}" 
    logger.info(f"{msg}")
  finally:
    if conn:
      conn.close()