const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL; 

const send_voucher = (voucher) => {
  send_post("voucher",voucher)
} 

const send_notice = (notice) => {
  send_post("notice",notice)
}
   
const send_report = (report) => {
  send_post("report",report)
}
   
const send_exception = (exception) => {
  send_post("exception",exception)
}

const send_post = async (endpoint,jsonData) => {
  const response = await fetch(rollup_server + `/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData), // @TODO revise?
  });
  console.log(`/${endpoint}: Received response status ${response.status} body ${response.statusText}`)
}  

module.exports = { send_notice, send_voucher, send_post, send_report, send_exception };