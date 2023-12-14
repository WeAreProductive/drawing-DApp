/**
 * Converts Drawing
 * to svg string and json string
 * sends drawing data to rollups
 * to request a voucher for minting an NFT
 * and a notice with the current drawing data
 */
import { useCanvasContext } from "../../context/CanvasContext";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast, Button } from "@chakra-ui/react";
import { useSetChain, useWallets } from "@web3-onboard/react";

import { InputBox__factory } from "@cartesi/rollups";

import { storeAsFiles } from "../../services/canvas";
import {
  ERC721_TO_MINT,
  MINT_SELECTOR,
  DAPP_ADDRESS,
  DAPP_STATE,
  LOG_ACTIONS,
  COMMANDS,
} from "../../shared/constants";
import configFile from "../../config/config.json";
import {
  DrawingInput,
  DrawingInputExtended,
  Network,
} from "../../shared/types";

import moment from "moment";
const config: { [name: string]: Network } = configFile;

const CanvasToJSON = () => {
  const [connectedWallet] = useWallets();
  const { canvas, dappState, currentDrawingData, setDappState } =
    useCanvasContext();
  const [{ connectedChain }] = useSetChain();
  const toast = useToast();
  const [inputBoxAddress, setInputBoxAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connectedChain) return;
    setInputBoxAddress(config[connectedChain.id].InputBoxAddress);
  }, [connectedChain]);

  const handleCanvasToSvg = async () => {
    if (!canvas) return;
    toast({
      title: "Sending input to rollups...",
      status: "warning",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    setLoading(true);

    const sendInput = async (strInput: string, svg: string) => {
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );
      const signer = provider.getSigner();
      // prepare drawing data notice input
      let drawingNoticePayload: DrawingInput | DrawingInputExtended;
      let str: string;
      if (dappState == DAPP_STATE.drawingUpdate && currentDrawingData) {
        drawingNoticePayload = {
          ...currentDrawingData,
          drawing: svg, // FE updates the svg string only
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, //data to save in a notice
          image: strInput,
          erc721_to_mint: ERC721_TO_MINT,
          selector: MINT_SELECTOR,
          cmd: COMMANDS.updateAndMint.cmd,
        });
      } else {
        // new drawing is sent to rollups, and voucher is requested
        const timestamp = moment().unix();
        drawingNoticePayload = {
          drawing: svg, // FE is responsible for the svg string only
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, //data to save in a notice
          image: strInput,
          erc721_to_mint: ERC721_TO_MINT,
          selector: MINT_SELECTOR,
          cmd: COMMANDS.createAndMint.cmd,
        });
      }

      // Instantiate the InputBox contract
      const inputBox = InputBox__factory.connect(inputBoxAddress, signer);

      // Encode the input
      const inputBytes = ethers.utils.isBytesLike(str)
        ? str
        : ethers.utils.toUtf8Bytes(str);

      // Send the transaction
      const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
      toast({
        title: "Transaction Sent",
        description: "waiting for confirmation",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-left",
      });

      // Wait for confirmation
      console.log("waiting for confirmation...");
      const receipt = await tx.wait(1);

      // Search for the InputAdded event
      const event = receipt.events?.find((e) => e.event === "InputAdded");
      setLoading(false);
      setDappState(DAPP_STATE.canvasSave);
      let toastData = {};
      if (event?.args?.inputIndex) {
        canvas.clear();
        toastData = {
          title: "Transaction Confirmed",
          description: `Input added => index: ${event?.args?.inputIndex} `,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-left",
        };
      } else {
        toastData = {
          title: "Error",
          description: `Input not added => index: ${event?.args?.inputIndex} `,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-left",
        };
      }
      toast(toastData);
      console.log(`Input added => index: ${event?.args?.inputIndex} `);
    };
    const canvasContent = canvas.toJSON();
    const canvasSVG = canvas.toSVG();
    const base64str = await storeAsFiles(canvasContent.objects);
    sendInput(base64str, canvasSVG);
  };
  let buttonProps = { isLoading: false };
  if (loading) {
    buttonProps.isLoading = true;
  }
  // @TODO disable if no loaded / drawn image on the canvas
  return connectedChain ? (
    <Button
      {...buttonProps}
      onClick={handleCanvasToSvg}
      className="button canvas-mint">
      Mint NFT
    </Button>
  ) : null;
};

export default CanvasToJSON;
