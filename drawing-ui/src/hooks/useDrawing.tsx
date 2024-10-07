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
  console.log({ currentDrawingData });
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const currentUuid = uuidv4();
  const getNoticeInput = (
    canvasData: { content: DrawingObject[] },
    // uuid: string,
  ): string => {
    const canvasDimensions = {
      width: canvas?.width || 0,
      height: canvas?.height || 0,
    };
    // prepare drawing data notice input
    let drawingNoticePayload: DrawingInput;
    const cmd =
      dappState == DAPP_STATE.drawingUpdate
        ? COMMANDS.updateAndStore.cmd
        : COMMANDS.createAndStore.cmd;
    // next 2 depend on the dappState also
    const log = currentDrawingData ? currentDrawingData.log : [];
    const uuid = currentDrawingData ? currentDrawingData.uuid : currentUuid;
    const owner = currentDrawingData ? currentDrawingData.owner : account;
    const privateDrawing = currentDrawingData
      ? currentDrawingData.private
      : "1"; // @TODO - add UI to handle is private

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
  ) => {
    // prepare drawing data notice input
    let drawingNoticePayload: DrawingInput;
    const cmd =
      dappState == DAPP_STATE.drawingUpdate
        ? COMMANDS.updateAndMint.cmd
        : COMMANDS.createAndMint.cmd;
    const log = currentDrawingData ? currentDrawingData.log : [];
    drawingNoticePayload = {
      drawing: JSON.stringify(canvasData), // FE updates the svg string only, compressedCanvasData
      dimensions: drawingMeta.canvasDimensions,
      log,
    };
    return JSON.stringify({
      drawing_input: drawingNoticePayload, //data to save in a notice and partially in the sqlite db
      uuid,
      cmd, // BE will be notified to emit a notice and a voucher
      imageIPFSMeta:
        "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
      erc721_to_mint: ercToMint,
      selector: MINT_SELECTOR,
    });
  };
  return { getNoticeInput, getVoucherInput };
};
