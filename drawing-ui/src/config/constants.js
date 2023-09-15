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
export const ERC721_TO_MINT = "0x59b670e9fA9D0A427751Af201D676719a970857b";
export const MINT_SELECTOR = "0xd0def521";

//localhost
export const DEFAULT_CHAIN = networks[31337];
//Goerli
// export const DEFAULT_CHAIN = networks[5];
//Arbitrum Goerli
//export const DEFAULT_CHAIN = networks[421613];

export const LOCALHOST_DAPP_ADDRESS =
  "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A";
// Standard configuration for local development environment
// export const INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768";
export const INPUTBOX_ADDRESS = "0x5a723220579C0DCb8C9253E6b4c62e572E379945"; //@TODO get it dynamically