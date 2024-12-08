import logging 
from datetime import datetime

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__) 
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
  """Calculates the when the drawing is closed in seconds
  Parameters
  ----------
  page : string 
    
  Raises
  ------
  Returns
  -------
    offset: number
      closed at (timestamp in seconds)
  """
  # hours * min * s
  seconds_period = int(end)*60*60
  closed_at = seconds_period + now
  # check
  logger.info(f"Expires at {datetime.fromtimestamp(closed_at)}")
  return closed_at