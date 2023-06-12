import { useCanvasContext } from "../../context/CanvasContext";
import React, { useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { InputFacet__factory } from "@cartesi/rollups";
import { useToast, Button } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { storeAsFiles } from "../../services/canvas";

const HARDHAT_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";
const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545";
const LOCALHOST_DAPP_ADDRESS = "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A";

const CanvasToJSON = () => {
  const { canvas } = useCanvasContext();
  const [accountIndex] = useState(0);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const handleCanvasToSvg = async () => {
    // toast({
    //   title: "Sending input to rollups...",
    //   status: "warning",
    //   duration: 3000,
    //   isClosable: true,
    //   position: "top",
    // });
    // const canvasData = JSON.stringify(canvas.toSVG()); //data to be saved in rollups
    //for better handling - send the canvas as json
    const canvasContent = canvas.toJSON(); //toDataLessJSON minifies the data
    console.log(canvasContent);
    const canvasName = uuidv4();
    const canvasData = JSON.stringify({
      content: canvasContent,
      name: canvasName,
    });

    storeAsFiles(canvasContent.objects)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    // const sendInput = async () => {
    //   setLoading(true);
    //   // Start a connection
    //   const provider = new JsonRpcProvider(HARDHAT_LOCALHOST_RPC_URL);
    //   const signer = ethers.Wallet.fromMnemonic(
    //     HARDHAT_DEFAULT_MNEMONIC,
    //     `m/44'/60'/0'/0/${accountIndex}`
    //   ).connect(provider);

    //   // Instantiate the Input Contract
    //   const inputContract = InputFacet__factory.connect(
    //     LOCALHOST_DAPP_ADDRESS,
    //     signer
    //   );

    //   // Encode the input
    //   const inputBytes = ethers.utils.isBytesLike(canvasData)
    //     ? canvasData
    //     : ethers.utils.toUtf8Bytes(canvasData);

    //   // Send the transaction
    //   const tx = await inputContract.addInput(inputBytes);
    //   console.log(`transaction: ${tx.hash}`);
    //   toast({
    //     title: "Transaction Sent",
    //     description: "waiting for confirmation",
    //     status: "success",
    //     duration: 9000,
    //     isClosable: true,
    //     position: "top-left",
    //   });

    //   // Wait for confirmation
    //   console.log("waiting for confirmation...");
    //   const receipt = await tx.wait(1);

    //   // Search for the InputAdded event
    //   const event = receipt.events?.find((e) => e.event === "InputAdded");

    //   setLoading(false);
    //   toast({
    //     title: "Transaction Confirmed",
    //     description: `Input added => epoch : ${event?.args.epochNumber} index: ${event?.args.inputIndex} `,
    //     status: "success",
    //     duration: 9000,
    //     isClosable: true,
    //     position: "top-left",
    //   });
    //   toast({
    //     title: "The saved canvas",
    //     description:
    //       "will appear on the left once its notice is in the rollups",
    //     status: "warning",
    //     duration: 15000,
    //     isClosable: true,
    //     position: "top",
    //   });
    //   console.log(
    //     `Input added => epoch : ${event?.args.epochNumber} index: ${event?.args.inputIndex} `
    //   );
    // };
    // sendInput();
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
