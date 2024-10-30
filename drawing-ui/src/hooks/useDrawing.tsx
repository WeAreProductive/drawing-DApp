import { useCanvasContext } from "../context/CanvasContext";
import { COMMANDS, ETHER_TRANSFER_SELECTOR } from "../shared/constants";
import {
  Address,
  DrawingMeta,
  DrawingObject,
  NetworkConfigType,
} from "../shared/types";
import configFile from "../config/config.json";
import { useWallets } from "@web3-onboard/react";
import { ethers } from "ethers";

const config: { [name: string]: NetworkConfigType } = configFile;

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
    uuid: string,
    drawingMeta: DrawingMeta,
    ercToMint: Address,
    address: Address, //dappRelayAddress
  ) => {
    // @TODO VoucherMintPayloadType
    let voucherMintPayload: any;

    const execLayerData = JSON.stringify({
      uuid, // notice to register the img for this voucher
      cmd: COMMANDS.mintDrawingAsNFT.cmd, // BE will be notified to emit a notice and a voucher
      imageIPFSMeta:
        "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
      erc721_to_mint: ercToMint,
      selector: ETHER_TRANSFER_SELECTOR,
    });
    const amount = currentDrawingData?.minting_price;
    const data = ethers.utils.toUtf8Bytes(execLayerData);
    return { address, data, amount };
  };
  return { getNoticeInput, getVoucherInput };
};
