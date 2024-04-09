import axios from "axios";
import http from "http";
import pako from "pako";

export const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const send_post = (endpoint, jsonData) => {
  axios.defaults.httpAgent = new http.Agent({ keepAlive: true });
  axios
    .post(
      rollup_server + `/${endpoint}`,
      pako.deflate(JSON.stringify(jsonData)),
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "deflate",
        },
      }
    )
    .then(function (response) {
      console.log(
        `/${endpoint}: Received response status ${response.status} body ${response.statusText}`
      );
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
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
