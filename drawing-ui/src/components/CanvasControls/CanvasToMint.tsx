/**
 * Converts Drawing
 * to json string
 * sends last drawing layer's data to rollups
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

import { DAPP_STATE } from "../../shared/constants";
import pako from "pako";

import { DrawingMeta, Network } from "../../shared/types";
import { prepareDrawingObjectsArrays, validateInputSize } from "../../utils";
import { useDrawing } from "../../hooks/useDrawing";

const config: { [name: string]: Network } = configFile;

type CanvasToMintProp = {
  enabled: boolean;
};
const CanvasToMint = ({ enabled }: CanvasToMintProp) => {
  const [connectedWallet] = useWallets();
  const { canvas, currentDrawingData, setDappState, clearCanvas } =
    useCanvasContext();
  const { getVoucherInput } = useDrawing();
  const [{ connectedChain }] = useSetChain();
  const [inputBoxAddress, setInputBoxAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const uuid = uuidv4();
  useEffect(() => {
    if (!connectedChain) return;
    setInputBoxAddress(config[connectedChain.id].InputBoxAddress);
  }, [connectedChain]);
  const handleCanvasToMint = async () => {
    if (!canvas) return;
    setLoading(true);

    const sendInput = async (strInput: string) => {
      toast.info("Sending input to rollups...");

      if (!connectedChain) return;
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider,
      );

      const signer = provider.getSigner();

      // Instantiate the InputBox contract
      const inputBox = InputBox__factory.connect(inputBoxAddress, signer);
      // compress before encoding the input
      const compressedStr = pako.deflate(strInput);
      // Encode the input
      const inputBytes = ethers.utils.isBytesLike(compressedStr)
        ? compressedStr
        : ethers.utils.toUtf8Bytes(compressedStr);
      console.log(`Canvas to Mint ${inputBytes.length} Bytes`);

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
    // @TODO refractor
    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    const currentDrawingLayer = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    ); // extracts the currents session drawing objects using the old and current drawing data
    let canvasData = {
      // svg: base64_encode(canvasSVG), // for validation before minting
      content: currentDrawingLayer,
    };
    // validate before sending the tx
    const result = validateInputSize(
      currentDrawingData,
      JSON.stringify(canvasData),
    );

    if (!result.isValid) {
      toast.error(result.info.message, {
        description: result.info.description,
      });
      setLoading(false);
      return;
    }

    const drawingMeta: DrawingMeta = await storeAsFiles(
      canvasContent.objects,
      uuid,
      {
        width: canvas.width || 0,
        height: canvas.height || 0,
      },
    );
    if (!connectedChain) return;
    // sendInput(drawingMeta, JSON.stringify(canvasData));
    const strInput = getVoucherInput(
      canvasData,
      uuid,
      drawingMeta,
      config[connectedChain.id].ercToMint,
    );
    sendInput(strInput);
  };

  return connectedChain ? (
    <Button
      variant={"outline"}
      onClick={handleCanvasToMint}
      disabled={loading || !enabled}
    >
      <Box size={18} className="mr-2" strokeWidth={1.5} />
      {loading ? " Queuing NFT for minting..." : " Save & Mint NFT"}
    </Button>
  ) : null;
};

export default CanvasToMint;
