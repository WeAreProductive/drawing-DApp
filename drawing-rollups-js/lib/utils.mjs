import { ethers } from "ethers";

/**
 * Encode a string as a hex string
 * @param {String} string
 */
export const str2hex = (string) => {
  return ethers.utils?.hexlify(ethers.utils?.toUtf8Bytes(string));
};

/**
 * Decodes a hex string into
 * a regular string
 * @param {String} hexstr
 */
export const hex2str = (hexstr) => {
  return ethers.utils?.toUtf8String(hexstr);
};

/**
 * Decodes a hex string into
 * a regular byte string
 *
 * @param {String} hexstr
 */
export const hex2binary = (hexstr) => {
  return ethers.utils?.hexlify(hexstr);
};

/**
 * Get current datetime
 * formatted as 'yyyy-mm-dd'
 * @returns String
 */
export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

/**
 * Get current timestamp
 * @returns
 */
export const getCurrentTimestamp = () => {
  const now = new Date();
  return now.getTime();
};

export const clean_header = (mintHeader) => {
  return hex2binary(mintHeader);
};
