export const BASE_API_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
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
export const ERC721_TO_MINT = "0x3F101a631Bce1374A7138c3ec02994344E350a89";
export const MINT_SELECTOR = "0xd0def521";

// OBS: change the DApp address as appropriate
export const DAPP_ADDRESS = "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C";
// Standard configuration for local development environment
export const INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768"; //@TODO get it dynamically
