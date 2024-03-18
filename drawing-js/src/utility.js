/**
 * Utility functions
 */
const { ethers } = require("ethers"); 
/**
 * Encode a string as a hex string
 * @param {String} string 
 */
const str2hex = (string) => {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(string));
}
/**
 * Decodes a hex string into 
 * a regular string
 * @param {String} hexstr 
 */
const hex2str = (hexstr) => {
  return ethers.utils.toUtf8String(hexstr)
}
/**
 * Decodes a hex string into 
 * a regular byte string
 * 
 * @param {String} hexstr 
 */
const hex2binary = (hexstr) => {
  return ethers.utils.hexlify(hexstr);
} 

/**
 * Get current datetime
 * formatted as 'yyyy-mm-dd'
 * @returns String
 */
const getCurrentDate = () => {  
  const now = new Date(); 
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2); 

  return `${year}-${month}-${day}`;
}
/**
 * Get current timestamp
 * @returns 
 */
const getCurrentTimestamp = () => {
  const now = new Date();
  return now.getTime(); 
}

const clean_header = (mintHeader) => { 
  return hex2binary(mintHeader);
}

module.exports = { hex2binary, hex2str, str2hex, getCurrentDate, getCurrentTimestamp, clean_header };