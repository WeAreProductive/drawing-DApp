import { useCanvasContext } from "../../context/CanvasContext";
import React, { useState } from "react";
import { ethers } from "ethers"; 
import { useToast, Button } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";

import { InputBox__factory } from "@cartesi/rollups";

import { storeAsFiles } from "../../services/canvas";
import {
  ERC721_TO_MINT,
  MINT_SELECTOR,
  DAPP_ADDRESS,
  INPUTBOX_ADDRESS,
} from "../../shared/constants";

const CanvasToJSON = () => {
  const [connectedWallet] = useWallets();
  const { canvas } = useCanvasContext();

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

    const sendInput = async (strInput) => {
      const str = JSON.stringify({
        image: strInput,
        erc721_to_mint: ERC721_TO_MINT,
        selector: MINT_SELECTOR,
      });
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );
      const signer = provider.getSigner();

      // Instantiate the InputBox contract
      const inputBox = InputBox__factory.connect(INPUTBOX_ADDRESS, signer);

      // Encode the input
      const inputBytes = ethers.utils.isBytesLike(str)
        ? str
        : ethers.utils.toUtf8Bytes(str);

      // Send the transaction
      const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
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
      console.log({ event });
      setLoading(false);
      toast({
        title: "Transaction Confirmed",
        description: `Input added => index: ${event?.args.inputIndex} `,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-left",
      });
      console.log(`Input added => index: ${event?.args.inputIndex} `);
    };
    sendInput(base64str);
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
