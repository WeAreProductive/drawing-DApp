export const BASE_API_URL = process.env.BASE_API_URL;

export const API_ENDPOINTS = {
  canvasesStore: "canvases/store",
};

export const INITIAL_DRAWING_OPTIONS = {
  color: "#000000",
  backgroundColor: "transparent",
  brushWidth: 10,
  minBrushWidth: 1,
  canvasWidth: 280,
  canvasHeight: 280,
};

//mint method selector constant
export const MINT_SELECTOR = "0xd0def521";

export const DAPP_STATE = {
  canvasInit: "initialize a canvas",
  canvasClear: "canvas clear",
  canvasSave: "saving the canvas in a rollups notice",
  drawingUpdate: "updating existing drawing",
  voucherRequset: "requesting a voucher for minting an nft from the drawing", //
};

export const COMMANDS = {
  createAndStore: {
    cmd: "cn",
    description:
      "BE will emit a notice with the data of the newly created drawing",
  },
  updateAndStore: {
    cmd: "un",
    description: "BE will emit a notice with the data of the updated drawing",
  },
  createAndMint: {
    cmd: "cv",
    description:
      "BE will emit a notice (with the data of the newly created drawing) and a voucher to mint a NFT",
  },
  updateAndMint: {
    cmd: "uv",
    description:
      "BE will emit a notice (with the data of the updated drawing) and a voucher to mint a NFT",
  },
};
