import { useCanvasContext } from "../context/CanvasContext";
import { COMMANDS, DAPP_STATE, MINT_SELECTOR } from "../shared/constants";
import {
  CanvasDimensions,
  DrawingInput,
  DrawingInputExtended,
  Network,
} from "../shared/types";
import configFile from "../config/config.json";

const config: { [name: string]: Network } = configFile;

export const useDrawing = () => {
  const { currentDrawingData, dappState, canvas } = useCanvasContext();
  console.log(currentDrawingData);
  const getNoticeInput = (canvasData: any, uuid: string): string => {
    const canvasDimensions = {
      width: canvas?.width || 0,
      height: canvas?.height || 0,
    };
    // prepare drawing data notice input
    let drawingNoticePayload: DrawingInput | DrawingInputExtended;
    const cmd =
      dappState == DAPP_STATE.drawingUpdate
        ? COMMANDS.updateAndStore.cmd
        : COMMANDS.createAndStore.cmd;
    const log = currentDrawingData ? currentDrawingData.log : [];
    drawingNoticePayload = {
      // ...currentDrawingData,
      drawing: JSON.stringify(canvasData), // FE updates the svg string
      dimensions: canvasDimensions,
    };

    return JSON.stringify({
      drawing_input: drawingNoticePayload,
      log,
      uuid,
      cmd, // BE will be notified to emit a notice
    });
  };

  const getVoucherInput = (
    canvasData: any,
    uuid: string,
    drawingMeta: {
      // base64out: string; @TODO new BE validation
      ipfsHash: string;
      canvasDimensions: CanvasDimensions;
    },
    ercToMint: string,
  ) => {
    // prepare drawing data notice input
    let drawingNoticePayload: DrawingInput | DrawingInputExtended;

    if (dappState == DAPP_STATE.drawingUpdate && currentDrawingData) {
      drawingNoticePayload = {
        ...currentDrawingData,
        drawing: JSON.stringify(canvasData), // FE updates the svg string only, compressedCanvasData
        dimensions: drawingMeta.canvasDimensions,
      };
      return JSON.stringify({
        drawing_input: drawingNoticePayload, //data to save in a notice
        // imageBase64: drawingMeta.base64out, @TODO new BE validation
        imageIPFSMeta:
          "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
        // imageIPFSMeta: "ipfs://" + drawingMeta.ipfsHash,
        uuid: uuid,
        erc721_to_mint: ercToMint,
        selector: MINT_SELECTOR,
        cmd: COMMANDS.updateAndMint.cmd,
      });
    } else {
      // new drawing is sent to rollups, and voucher is requested
      drawingNoticePayload = {
        drawing: JSON.stringify(canvasData), // FE is responsible for the svg string only
        dimensions: drawingMeta.canvasDimensions,
      };
      return JSON.stringify({
        drawing_input: drawingNoticePayload, //data to save in a notice
        // imageBase64: drawingMeta.base64out, @TODO new BE validation
        canvasDimensions: drawingMeta.canvasDimensions,
        imageIPFSMeta:
          "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
        // imageIPFSMeta: "ipfs://" + drawingMeta.ipfsHash,
        uuid: uuid,
        erc721_to_mint: ercToMint,
        selector: MINT_SELECTOR,
        cmd: COMMANDS.createAndMint.cmd,
      });
    }
  };
  return { getNoticeInput, getVoucherInput };
};
