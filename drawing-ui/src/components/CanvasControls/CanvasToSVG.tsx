/**
 * Convert Drawings to svg strings
 * and save the drawings data in rollups
 * as notices
 */

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast, Button } from "@chakra-ui/react";
import { useSetChain, useWallets } from "@web3-onboard/react";
import moment from "moment";

import { InputBox__factory } from "@cartesi/rollups";

import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_ADDRESS, DAPP_STATE } from "../../shared/constants";
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
      let drawingNoticePayload: DrawingInput;
      if (dappState == DAPP_STATE.DRAWING_UPDATE && currentDrawingData) {
        currentDrawingData.updateLog.push({
          dateUpdated: now,
          painter: connectedWallet.accounts[0].address,
        });

        drawingNoticePayload = {
          ...currentDrawingData,
          lastUpdated: now,
          owner: connectedWallet.accounts[0].address,
          drawing: strInput,
        };
      } else {
        // new drawing is sent to rollups
        drawingNoticePayload = {
          id: `${connectedWallet.accounts[0].address}-${timestamp}`,
          dateCreated: now,
          lastUpdated: null,
          owner: connectedWallet.accounts[0].address,
          updateLog: [],
          drawing: strInput,
        };
      }

      // Instantiate the InputBox contract
      const inputBox = InputBox__factory.connect(inputBoxAddress, signer);

      // Encode the input
      const inputBytes = ethers.utils.isBytesLike(
        JSON.stringify(drawingNoticePayload)
      )
        ? JSON.stringify(drawingNoticePayload)
        : ethers.utils.toUtf8Bytes(JSON.stringify(drawingNoticePayload));
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
      setDappState(DAPP_STATE.CANVAS_SAVE);
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

