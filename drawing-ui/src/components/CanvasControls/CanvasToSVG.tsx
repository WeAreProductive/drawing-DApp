/**
 * Converts Drawing to svg string
 * sends drawing data to rollups
 * to emit a NOTICE with
 * the current drawing data
 */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { InputBox__factory } from "@cartesi/rollups";
import { useCanvasContext } from "../../context/CanvasContext";
import { COMMANDS, DAPP_ADDRESS, DAPP_STATE } from "../../shared/constants";
import configFile from "../../config/config.json";
import {
  DrawingInput,
  DrawingInputExtended,
  Network,
} from "../../shared/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const config: { [name: string]: Network } = configFile;

const CanvasToSVG = () => {
  const [connectedWallet] = useWallets();
  const { canvas, dappState, setDappState, currentDrawingData, clearCanvas } =
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

    // Gets current drawing data as SVG
    const canvasData = canvas.toSVG({
      viewBox: {
        x: 0,
        y: 0,
        width: canvas.width || 0,
        height: canvas.height || 0,
      },
      width: canvas.width || 0,
      height: canvas.height || 0,
    });
    const sendInput = async (strInput: string) => {
      // Start a connection
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider,
      );

      const signer = provider.getSigner();

      // prepare drawing data notice input
      let drawingNoticePayload: DrawingInput | DrawingInputExtended; // @TODO fix typing
      let str: string;

      if (dappState == DAPP_STATE.drawingUpdate && currentDrawingData) {
        drawingNoticePayload = {
          ...currentDrawingData,
          drawing: strInput, // FE updates the svg string
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload,
          uuid: uuid,
          cmd: COMMANDS.updateAndStore.cmd, // BE will be notified to emit a notice
        });
      } else {
        drawingNoticePayload = {
          drawing: strInput, // FE is responsible for the svg string only
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, // data to save in a notice
          uuid: uuid,
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
      try {
        const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
        toast.success("Transaction Sent");

        // Wait for confirmation
        console.log("waiting for confirmation...");
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
          toast.error("Transaction Error", {
            description: `Input not added => index: ${event?.args?.inputIndex} `,
          });
        }
        console.log(`Input added => index: ${event?.args?.inputIndex} `);
      } catch (e: any) {
        const reason = e.hasOwnProperty("reason") ? e.reason : "MetaMask error";
        toast.error("Transaction Error", {
          description: `Input not added => ${reason}`,
        });
        setLoading(false);
      }
    };

    sendInput(canvasData);
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleCanvasToSvg}
      disabled={!connectedChain || loading}
    >
      <Save size={18} className="mr-2" strokeWidth={1.5} />
      {loading ? "Saving..." : "Save"}
    </Button>
  );
};

export default CanvasToSVG;
