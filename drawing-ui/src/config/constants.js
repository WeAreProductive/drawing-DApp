import { networks } from "./networks";
export const BASE_API_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  // canvasLoad: "canvas/load",
  // imagesList: "images/list",
  canvasesStore: "canvases/store",
};

export const INITIAL_DRAWING_OPTIONS = {
  color: "#000000",
  backgroundColor: "#ffffff",
  brushWidth: 10,
  minBrushWidth: 1,
  canvasWidth: 600,
  canvasHeight: 600,
};
//the nft smart contract
export const ERC721_TO_MINT = "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690";
export const MINT_SELECTOR = "0xd0def521";

//localhost
export const DEFAULT_CHAIN = networks[31337];
//Goerli
// export const DEFAULT_CHAIN = networks[5];
//Arbitrum Goerli
//export const DEFAULT_CHAIN = networks[421613];
