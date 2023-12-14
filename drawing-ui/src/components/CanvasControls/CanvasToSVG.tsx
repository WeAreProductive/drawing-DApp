/**
 * Converts Drawing to svg string
 * sends drawing data to rollups
 * to emit a notice with 
 * the current drawing data
 */ 
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast, Button } from "@chakra-ui/react";
import { useSetChain, useWallets } from "@web3-onboard/react";
import moment from "moment";

import { InputBox__factory } from "@cartesi/rollups";

import { useCanvasContext } from "../../context/CanvasContext";
import {
  COMMANDS,
  DAPP_ADDRESS,
  DAPP_STATE,
  LOG_ACTIONS,
} from "../../shared/constants";
import configFile from "../../config/config.json";
import { DrawingInput, Network } from "../../shared/types";
const config: { [name: string]: Network } = configFile;

const CanvasToSVG = () => {
  const [connectedWallet] = useWallets();
  const { canvas, dappState, setDappState, currentDrawingData } =
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

    const canvasData = canvas.toSVG();
    const sendInput = async (strInput: string) => {
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );
      const signer = provider.getSigner();
      const now = moment().utc().format("YY-MM-DD hh:mm:s");
      const timestamp = moment().unix();

      // prepare drawing data notice input
      let drawingNoticePayload: any; // @TODO fix typing
      let str: string;
      if (dappState == DAPP_STATE.drawingUpdate && currentDrawingData) {
        drawingNoticePayload = {
          ...currentDrawingData,
          drawing: strInput, // FE updates the svg string
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload,
          cmd: COMMANDS.updateAndStore.cmd, // BE will be notified to emit a notice
        });
      } else {
        drawingNoticePayload = {
          drawing: strInput, // FE is responsible for the svg string only
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, // data to save in a notice
          cmd: COMMANDS.createAndStore.cmd, // BE will be notified to emit a notice
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
      setDappState(DAPP_STATE.canvasSave);
      setLoading(false);
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
    sendInput(canvasData);
  };
  let buttonProps = { isLoading: false };
  if (loading) {
    buttonProps.isLoading = true;
  }

  return connectedChain ? (
    <Button
      {...buttonProps}
      onClick={handleCanvasToSvg}
      className="button canvas-store">
      Save Canvas
    </Button>
  ) : (
    <Button disabled className="button disabled">
      Save Canvas
    </Button>
  );
};

export default CanvasToSVG;

