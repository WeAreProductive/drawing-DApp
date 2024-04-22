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

export const VOUCHER_INPUT_LMIT = 128000; // bytes
// ~ voucher request size / notice request size with same image
const VIL_TO_NIL = 2.6;
// voucher input limit / how many times the voucher input is bigger than the notice input in bytes
export const NOTICE_INPUT_LIMIT = VOUCHER_INPUT_LMIT / VIL_TO_NIL; // 160000
// ~ notice request size / canvas(svg) data size in bytes
const NIL_TO_IMAGE_DATA = 1.2;
// canvas(svg) data limit in bytes - 13 913
export const NOTICE_CANVAS_DATA_LIMIT = NOTICE_INPUT_LIMIT / NIL_TO_IMAGE_DATA;
// canvas(svg) data limit in bytes - 13 913
export const CANVAS_DATA_LIMIT = NOTICE_INPUT_LIMIT / NIL_TO_IMAGE_DATA;

// ~ svg string length svg / canvas data
const CANVAS_SVG_STR_LEN_TO_NOTICE_CANVAS_DATA = 4;
// ~ allowed svg string length
export const CANVAS_SVG_STR_LEN_LIMIT =
  NOTICE_CANVAS_DATA_LIMIT * CANVAS_SVG_STR_LEN_TO_NOTICE_CANVAS_DATA;

// in %, at what size the warning will appear
export const LIMIT_WARNING_AT = 0.9;

export const VALIDATE_INPUT_ERRORS = {
  warning: {
    message: "You are approaching the allowed size limit!",
    description: "",
  },
  error: {
    message: "Allowed size exceeded!",
    description: "Please, reduce the drawing size!",
  },
};
