import { useCanvasContext } from "../../context/CanvasContext";
import React, { useState } from "react";
import { ethers } from "ethers"; 
import { useToast, Button } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useRollups } from "../../hooks/useRollups";

import { InputBox__factory } from "@cartesi/rollups";

import { storeAsFiles } from "../../services/canvas";
import {
  ERC721_TO_MINT,
  MINT_SELECTOR,
  LOCALHOST_DAPP_ADDRESS,
  INPUTBOX_ADDRESS,
} from "../../config/constants";

const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545"; //@TODO get dynamically
const HARDHAT_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";
const CanvasToJSON = () => {
  // const rollups = useRollups(LOCALHOST_DAPP_ADDRESS);
  const [connectedWallet] = useWallets();

  const { canvas } = useCanvasContext();
  const [accountIndex] = useState(0);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const provider = new ethers.providers.Web3Provider(connectedWallet.provider);

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
      setLoading(true);
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );

      const signer = provider.getSigner();

      // Instantiate the InputBox contract
      const inputBox = InputBox__factory.connect(INPUTBOX_ADDRESS, signer);
      console.log({ inputBox });
      // Encode the input
      const inputBytes = ethers.utils.isBytesLike(str)
        ? str
        : ethers.utils.toUtf8Bytes(str);

      // Send the transaction
      const tx = await inputBox.addInput(LOCALHOST_DAPP_ADDRESS, inputBytes);
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
      console.log(receipt);
      // Search for the InputAdded event
      const event = receipt.events?.find((e) => e.event === "InputAdded");

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
