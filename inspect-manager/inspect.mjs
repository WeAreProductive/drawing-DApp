import moment from "moment";
import { API_ENDPOINTS } from "./config.mjs";
const manageContests = async () => {
  console.warn("Running inspect request ::...");
  const toMoment = moment().format();
  const now = moment(toMoment).unix();
  console.warn(`Current timestamp :: ${now}`);
  try {
    const response = await fetch(
      `http://localhost:8080/inspect/${API_ENDPOINTS.contestManager}/${now}`
    );
    console.warn(`Response status ${response.status}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const timeoutObj = setInterval(manageContests, 5000);
// const intervalId = timeoutObj[Symbol.toPrimitive](); //intervalId is an interger
