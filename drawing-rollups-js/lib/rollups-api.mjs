import axios from "axios";
import http from "http";
import pako from "pako";

export const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const send_post = async (endpoint, jsonData) => {
  axios.defaults.httpAgent = new http.Agent({ keepAlive: true });
  const res = await axios.post(
    rollup_server + `/${endpoint}`,
    pako.deflate(JSON.stringify(jsonData)),
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "deflate",
      },
    }
  );
  console.log(
    `/${endpoint}: Received response status ${res.status} body ${res.statusText}`
  );
};

export const send_voucher = async (voucher) => {
  await send_post("voucher", voucher);
};

export const send_notice = async (notice) => {
  await send_post("notice", notice);
};

export const send_report = async (report) => {
  await send_post("report", report);
};

export const send_exception = async (exception) => {
  await send_post("exception", exception);
};
