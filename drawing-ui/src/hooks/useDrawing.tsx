import { useCanvasContext } from "../context/CanvasContext";
import { COMMANDS, DAPP_STATE, MINT_SELECTOR } from "../shared/constants";
import {
  CanvasDimensions,
  DrawingInput,
  DrawingObject,
  Network,
} from "../shared/types";
import configFile from "../config/config.json";
import { v4 as uuidv4 } from "uuid";
import { useWallets } from "@web3-onboard/react";

const config: { [name: string]: Network } = configFile;

export const useDrawing = () => {
  const { currentDrawingData, dappState, canvas } = useCanvasContext();
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const getNoticeInput = (
    uuid: string,
    canvasData: { content: DrawingObject[] },
    drawingInputData: any,
  ): string => {
    // prepare drawing data nput
    let drawingPayload: any;
    const cmd = currentDrawingData
      ? COMMANDS.updateAndStore.cmd
      : COMMANDS.createAndStore.cmd;
    const canvasDimensions = {
      width: canvas?.width || 0,
      height: canvas?.height || 0,
    };

    if (cmd === COMMANDS.createAndStore.cmd) {
      // cmd - is sent outside of drawing input
      drawingPayload = {
        drawing: JSON.stringify(canvasData), // FE updates the svg string
        dimensions: canvasDimensions,
        userInputData: drawingInputData,
        owner: account,
        uuid,
      };
    } else if (cmd === COMMANDS.updateAndStore.cmd) {
      drawingPayload = {
        drawing: JSON.stringify(canvasData), // FE updates the svg string
        dimensions: canvasDimensions,
        uuid,
      };
    }

    return JSON.stringify({
      drawing_input: drawingPayload, //data to save in a notice and partially in the sqlite db
      cmd, // BE will be notified how to handle the payload
    });
  };

  const getVoucherInput = (
    canvasData: { content: DrawingObject[] },
    uuid: string,
    owner: `0x${string}`,
    drawingMeta: {
      ipfsHash: string;
      canvasDimensions: CanvasDimensions;
    },
    ercToMint: string,
    privateDrawing: 0 | 1,
  ) => {
    // prepare drawing data notice input
    let drawingNoticePayload: DrawingInput;
    const cmd =
      dappState == DAPP_STATE.drawingUpdate
        ? COMMANDS.updateAndMint.cmd
        : COMMANDS.createAndMint.cmd;
    drawingNoticePayload = {
      drawing: JSON.stringify(canvasData), // FE updates the svg string only, compressedCanvasData
      dimensions: drawingMeta.canvasDimensions,
    };
    return JSON.stringify({
      drawing_input: drawingNoticePayload, //data to save in a notice and partially in the sqlite db
      uuid,
      cmd, // BE will be notified to emit a notice and a voucher
      owner,
      private: privateDrawing,
      imageIPFSMeta:
        "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
      erc721_to_mint: ercToMint,
      selector: MINT_SELECTOR,
    });
  };
  return { getNoticeInput, getVoucherInput };
};
