## 
# Api functions

def send_voucher(voucher):
    send_post("voucher",voucher)

def send_notice(notice):
    send_post("notice",notice)

def send_report(report):
    send_post("report",report)

def send_exception(exception):
    send_post("exception",exception)

def send_post(endpoint,json_data):
    response = requests.post(rollup_server + f"/{endpoint}", json=json_data)
    logger.info(f"/{endpoint}: Received response status {response.status_code} body {response.content}")