/**
 * Converts Drawing
 * to svg string and json string
 * sends drawing data to rollups
 * to request a VOUCHER for minting an NFT
 * and a NOTICE with the current drawing data
 */
import { useCanvasContext } from "../../context/CanvasContext";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Box } from "lucide-react";
import { InputBox__factory } from "@cartesi/rollups";
import configFile from "../../config/config.json";
import { storeAsFiles } from "../../services/canvas";
import { v4 as uuidv4 } from "uuid";
import { encode as base64_encode } from "base-64";

import { MINT_SELECTOR, DAPP_STATE, COMMANDS } from "../../shared/constants";
import pako from "pako";

import {
  DrawingInput,
  DrawingInputExtended,
  Network,
} from "../../shared/types";

const config: { [name: string]: Network } = configFile;

const CanvasToJSON = () => {
  const [connectedWallet] = useWallets();
  const { canvas, dappState, currentDrawingData, setDappState, clearCanvas } =
    useCanvasContext();
  const [{ connectedChain }] = useSetChain();
  const [inputBoxAddress, setInputBoxAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const uuid = uuidv4();

  useEffect(() => {
    if (!connectedChain) return;
    setInputBoxAddress(config[connectedChain.id].InputBoxAddress);
  }, [connectedChain]);

  const handleCanvasToSvg = async () => {
    if (!canvas) return;

    toast.info("Sending input to rollups...");
    setLoading(true);

    const sendInput = async (
      drawingMeta: { base64out: string; ipfsHash: string },
      canvasData: string,
    ) => {
      if (!connectedChain) return;
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider,
      );

      const signer = provider.getSigner();

      // prepare drawing data notice input
      let drawingNoticePayload: DrawingInput | DrawingInputExtended;
      let str: string;

      if (dappState == DAPP_STATE.drawingUpdate && currentDrawingData) {
        drawingNoticePayload = {
          ...currentDrawingData,
          drawing: canvasData, // FE updates the svg string only
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, //data to save in a notice
          imageBase64: drawingMeta.base64out,
          imageIPFSMeta:
            "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
          // imageIPFSMeta: "ipfs://" + drawingMeta.ipfsHash,
          uuid: uuid,
          erc721_to_mint: config[connectedChain.id].ercToMint,
          selector: MINT_SELECTOR,
          cmd: COMMANDS.updateAndMint.cmd,
        });
      } else {
        // new drawing is sent to rollups, and voucher is requested
        drawingNoticePayload = {
          drawing: canvasData, // FE is responsible for the svg string only
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, //data to save in a notice
          imageBase64: drawingMeta.base64out,
          imageIPFSMeta:
            "https://gateway.pinata.cloud/ipfs/" + drawingMeta.ipfsHash,
          // imageIPFSMeta: "ipfs://" + drawingMeta.ipfsHash,
          uuid: uuid,
          erc721_to_mint: config[connectedChain.id].ercToMint,
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
      console.log(`voucher request: ${inputBytes.length}`);
      // Send the transaction
      if (!connectedChain) return;
      try {
        const tx = await inputBox.addInput(
          config[connectedChain.id].DAppRelayAddress,
          inputBytes,
        );
        toast.success("Transaction Sent");

        // Wait for confirmation
        const receipt = await tx.wait(1);

        // Search for the InputAdded event
        const event = receipt.events?.find((e) => e.event === "InputAdded");
        setLoading(false);
        setDappState(DAPP_STATE.canvasSave);

        if (event?.args?.inputIndex) {
          clearCanvas();
          toast.success("Transaction Confirmed", {
            description: `Input added => index: ${event?.args?.inputIndex} `,
          });
        } else {
          toast.error("Transaction Error", {
            description: `Input not added => index: ${event?.args?.inputIndex} `,
          });
        }
      } catch (e: any) {
        const reason = e.hasOwnProperty("reason") ? e.reason : "MetaMask error";
        toast.error("Transaction Error", {
          description: `Input not added => ${reason}`,
        });
        setLoading(false);
      }
    };

    const canvasContent = canvas.toJSON();
    const canvasSVG = canvas.toSVG();
    const canvasData = JSON.stringify({
      svg: base64_encode(canvasSVG),
      content: canvasContent.objects,
    });

    const drawingMeta = await storeAsFiles(canvasContent.objects, uuid);
    const compressed = pako.deflate(canvasData);
    console.log(`compressed ${compressed.length}`);
    console.log(`not compressed ${canvasData.length}`);
    sendInput(drawingMeta, compressed);
    // sendInput(drawingMeta, canvasData);
  };

  return connectedChain ? (
    <Button variant={"outline"} onClick={handleCanvasToSvg} disabled={loading}>
      <Box size={18} className="mr-2" strokeWidth={1.5} />
      {loading ? " Queuing NFT for minting..." : " Save & Mint NFT"}
    </Button>
  ) : null;
};

export default CanvasToJSON;
