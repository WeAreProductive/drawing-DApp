export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

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

export const VOUCHER_INPUT_LMIT = 400000; // bytes
const VIL_TO_IMAGE_DATA = 14; // ~ voucher request size / canvas data size in bytes
// export const VOUCHER_CANVAS_DATA_LIMIT = VOUCHER_INPUT_LMIT / VIL_TO_IMAGE_DATA; // 28571
const VIL_TO_NIL = 2.5; // ~ voucher request size / notice request size with same image
export const NOTICE_INPUT_LIMIT = VOUCHER_INPUT_LMIT / VIL_TO_NIL; // 160000
const NIL_TO_IMAGE_DATA = 11.5; // ~ notice request size / canvas data size in bytes
export const NOTICE_CANVAS_DATA_LIMIT = NOTICE_INPUT_LIMIT / NIL_TO_IMAGE_DATA; // canvas data limit in bytes - 13 913
export const CANVAS_DATA_LIMIT = NOTICE_INPUT_LIMIT / NIL_TO_IMAGE_DATA; // canvas data limit in bytes - 13 913
// svg string length svg / canvas data
const CANVAS_SVG_STR_LEN_TO_NOTICE_CANVAS_DATA = 4;
export const CANVAS_SVG_STR_LEN_LIMIT =
  NOTICE_CANVAS_DATA_LIMIT * CANVAS_SVG_STR_LEN_TO_NOTICE_CANVAS_DATA; // prevent canvas data will not exceed the max input size 55 652
export const LIMIT_WARNING_AT = 0.9; // in %, at what size the warning will appear 50 086
