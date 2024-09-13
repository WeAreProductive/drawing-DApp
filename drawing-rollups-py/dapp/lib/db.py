import sqlite3 
import logging

# @TODO document functions python way
# @TODO revise and remove obsolete variables and function declarations

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

db_filename = 'drawing.db'

def get_data(type, query_args):
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
        SELECT * FROM drawing
        """,
        (),
      )

      rows = cursor.fetchall()

      logger.info(f"Received finish status {rows}")

    except Exception as e: 
      msg = f"Error executing insert statement: {e}" 
    finally:
      if conn:
        conn.close()
    
def store_data(query_args):
  # prepare statement @TODO
  # execute statement
  # retrieves a cursor to the internal database
  """ create a database connection to an SQLite database """
  conn = None
  try:
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()
    
    cursor.execute(
        """
        INSERT INTO drawing(uuid, owner)
        VALUES (?, ?)
        """,
        (uuid, sender),
    )

    conn.commit()

    id = cursor.lastrowid
    logger.info(f"Last row id {id}") 

  except Exception as e: 
    msg = f"Error executing insert statement: {e}" 
  finally:
    if conn:
      conn.close()