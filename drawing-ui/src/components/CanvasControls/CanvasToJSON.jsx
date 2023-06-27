import { useCanvasContext } from "../../context/CanvasContext";
import React, { useState } from "react";
import { ethers } from "ethers"; 
import { useToast, Button } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";
import { useRollups } from "../../hooks/useRollups";

import { storeAsFiles } from "../../services/canvas";
import { ERC721_TO_MINT, MINT_SELECTOR } from "../../config/constants";

const CanvasToJSON = () => {
  const rollups = useRollups();
  const [connectedWallet] = useWallets();

  const { canvas } = useCanvasContext();
  const [accountIndex] = useState(0);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const handleCanvasToSvg = async () => {
    toast({
      title: "Sending input to rollups...",
      status: "warning",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    setLoading(true);
    const canvasContent = canvas.toJSON();
    const base64str = await storeAsFiles(canvasContent.objects);
    const addInput = async (strInput) => {
      const str = JSON.stringify({
        image: strInput,
        erc721_to_mint: ERC721_TO_MINT,
        selector: MINT_SELECTOR,
      });
      if (rollups) {
        try {
          const tx = await rollups.inputContract.addInput(
            ethers.utils.toUtf8Bytes(str)
          );
          console.log(`transaction: ${tx.hash}`);
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
          toast({
            title: "Transaction Confirmed",
            description: `Input added => epoch : ${event?.args.epochNumber} index: ${event?.args.inputIndex} `,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top-left",
          });
          console.log(
            `Input added => epoch : ${event?.args.epochNumber} index: ${event?.args.inputIndex} `
          );
        } catch (e) {
          console.log(e);
          toast({
            title: "Transaction Cancelled",
            description: `try again!`,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top-left",
          });
        }

        setLoading(false);
      }
    };

    addInput(base64str);
  };
  let buttonProps = {};
  if (loading) {
    buttonProps.isLoading = true;
  }
  return (
    <Button
      {...buttonProps}
      onClick={handleCanvasToSvg}
      className="button canvas-store">
      Save Canvas
    </Button>
  );
};

export default CanvasToJSON;
