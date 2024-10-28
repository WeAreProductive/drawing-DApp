export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const API_ENDPOINTS = {
  canvasesStore: "canvases/store",
};

export const INITIAL_DRAWING_OPTIONS = {
  isDrawingMode: true,
  color: "#000000",
  backgroundColor: "transparent",
  brushWidth: 10,
  minBrushWidth: 1,
  canvasWidth: 1280,
  canvasHeight: 1280,
  cursorType: "circle",
  selectionLineWidth: 1,
  perPixelTargetFind: false,
  preserveObjectStacking: true,
  selection: true,
  selectionFullyContained: true,
  interactive: true,
};

//mint method selector constant
export const MINT_SELECTOR = "0xd0def521";
export const ETHER_TRANSFER_SELECTOR = "0x522f6815"; // ether depsit header

export const DAPP_STATE = {
  canvasInit: "initialize a canvas",
  canvasClear: "canvas clear",
  canvasSave: "saving the canvas in a rollups notice",
  drawingUpdate: "updating existing drawing",
  voucherRequest: "requesting a voucher for minting an nft from the drawing", //
  refetchDrawings: "send inspect request to refetch drawings",
  txFail: "transaction failed",
};
// @TODO update the commands
export const COMMANDS = {
  createAndStore: {
    cmd: "cd",
    description:
      "BE will emit a notice with the data of the newly created drawing",
  },
  updateAndStore: {
    cmd: "ud",
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
  mintDrawingAsNFT: {
    cmd: "v-d-nft",
    description: "Emit a voucher to mint a drawing as nft",
  },
};

export const INPUT_LIMIT = 128000;
// export const INPUT_LIMIT = 64000;
// =========================================================
// bytes of Cartesi's JSON payload limit (2097152 bytes)
// =========================================================
// Metamsk tx limit is 131072
// =========================================================
// ~ voucher request size is almost equal to the notice request size with same image
// =========================================================
// notice input: currentDrawingData + last DrawingLayer's data = 99,6% of the input's size
// =========================================================
// voucher input: = currentDrawingData + last DrawingLayer's data 98.6% of the input's size
// =========================================================
// drawing input limit (currentDrawingData + last DrawingLayer)
export const DRAWING_INPUT_LIMIT = (INPUT_LIMIT * 97) / 100;
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

export const CANVAS_CURSOR_TYPES = {
  circle: "circle",
  spray: "spray",
};

export const CANVAS_DOWNLOAD_FILETYPES = {
  png: "png",
  svg: "svg",
};
