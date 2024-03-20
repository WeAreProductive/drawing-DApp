export const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const send_post = async (endpoint, jsonData) => {
  try {
    const response = await fetch(rollup_server + `/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    console.log(
      `/${endpoint}: Received response status ${response.status} body ${response.statusText}`
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

export const send_voucher = (voucher) => {
  send_post("voucher", voucher);
};

export const send_notice = (notice) => {
  send_post("notice", notice);
};

export const send_report = (report) => {
  send_post("report", report);
};

export const send_exception = (exception) => {
  send_post("exception", exception);
};
