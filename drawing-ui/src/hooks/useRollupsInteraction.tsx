import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { InputBox__factory } from "@cartesi/rollups";
import { useCanvasContext } from "../context/CanvasContext";
import { DAPP_STATE } from "../shared/constants";
import configFile from "../config/config.json";
import { Network } from "../shared/types";
import { toast } from "sonner";
import pako from "pako";

const config: { [name: string]: Network } = configFile;

// @TODO - voucher interaction ...

export const useRollupsInteraction = (): any => {
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const { setDappState, clearCanvas } = useCanvasContext();
  const [inputBoxAddress, setInputBoxAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connectedChain) return;
    setInputBoxAddress(config[connectedChain.id].InputBoxAddress);
  }, [connectedChain]);

  const sendInput = async (strInput: string) => {
    toast.info("Sending input to rollups...");
    // Start a connection
    const provider = new ethers.providers.Web3Provider(
      connectedWallet.provider,
    );

    const signer = provider.getSigner();

    // Instantiate the InputBox contract
    const inputBox = InputBox__factory.connect(inputBoxAddress, signer);
    // proceed after validation

    const compressedStr = pako.deflate(strInput);

    // Encode the input
    const inputBytes = ethers.utils.isBytesLike(compressedStr)
      ? compressedStr
      : ethers.utils.toUtf8Bytes(compressedStr);

    if (!connectedChain) return;
    // Send the transaction
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
      setDappState(DAPP_STATE.canvasSave);
      setLoading(false);
      if (event?.args?.inputIndex) {
        clearCanvas();
        toast.success("Transaction Confirmed", {
          description: `Input added => index: ${event?.args?.inputIndex} `,
        });
      } else {
        toast.error("Transaction Error 1", {
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

  return { sendInput, loading, setLoading };
};
