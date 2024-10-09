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
  const {
    currentDrawingData,
    dappState,
    canvas,
    currentDrawingLayer,
    tempDrawingData,
    setTempDrawingData,
  } = useCanvasContext();
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const currentUuid = uuidv4();
  console.log({ tempDrawingData });
  const getNoticeInput = (
    canvasData: { content: DrawingObject[] },
    uuid: string,
    owner: `0x${string}`,
    privateDrawing: 0 | 1,
    canvasDimensions: { width: number; height: number },
  ): string => {
    // prepare drawing data notice input
    let drawingNoticePayload: DrawingInput;
    const cmd =
      dappState == DAPP_STATE.drawingUpdate
        ? COMMANDS.updateAndStore.cmd
        : COMMANDS.createAndStore.cmd;

    const log = currentDrawingData ? currentDrawingData.log : [];
    console.log({ log });
    drawingNoticePayload = {
      drawing: JSON.stringify(canvasData), // FE updates the svg string
      dimensions: canvasDimensions,
      log,
    };
    return JSON.stringify({
      drawing_input: drawingNoticePayload, //data to save in a notice and partially in the sqlite db
      uuid,
      owner,
      cmd, // BE will be notified to emit a notice
      private: privateDrawing,
    });
  };
  // @TODO uuid in voucher input
  const getVoucherInput = (
    canvasData: { content: DrawingObject[] },
    uuid: string,
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
    const log = currentDrawingData ? currentDrawingData.log : [];
    const owner = currentDrawingData ? currentDrawingData.owner : account;

    drawingNoticePayload = {
      drawing: JSON.stringify(canvasData), // FE updates the svg string only, compressedCanvasData
      dimensions: drawingMeta.canvasDimensions,
      log,
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
