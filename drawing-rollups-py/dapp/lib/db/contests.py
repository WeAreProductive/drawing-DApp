import sqlite3 
import logging
import json   
from datetime import datetime

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)
# get_raw_data, get_data
db_filename = 'drawing.db'  

contest_minting_price = 1

def create_contest(data):
  try: 
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()  
    #  [contests, create, contest_data] 
    contest = json.loads(data[2])
    created_by = contest['created_by']
    created_at = contest['created_at']
    #
    contest_data = contest['data']
    logger.info(f"Contest data {contest_data}")
    title = contest_data['title']
    description = contest_data['description']
    active_from = contest_data['activeFrom']
    active_to = contest_data['activeTo']
    minting_active = contest_data['mintingOpen'] 
    logger.info(f"DATA {contest}")
    cursor.execute(
        """
        INSERT INTO contests(created_by, title, description, minting_price, active_from, active_to, minting_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (created_by, title, description, contest_minting_price, active_from, active_to, minting_active, created_at)
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
  return False

