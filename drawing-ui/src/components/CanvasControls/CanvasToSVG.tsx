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
import { COMMANDS, DAPP_STATE } from "../../shared/constants";
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
import { encode as base64_encode } from "base-64";
import pako from "pako";

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
    const canvasSVG = canvas.toSVG({
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
      let drawingNoticePayload: DrawingInput | DrawingInputExtended;
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

      console.log(`notice request compressed: ${inputBytes.length}`);
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

    // const canvasData = JSON.stringify({
    //   svg: base64_encode(canvasSVG),
    // });
    // const compressed = pako.deflate(canvasData);
    console.log(`Canvas svg length ${canvasSVG.length}`);
    const canvasData = {
      svg: base64_encode(canvasSVG),
    };

    const compressed = pako.deflate(JSON.stringify(canvasData));
    // const restored = JSON.parse(pako.inflate(compressed, { to: "string" }));
    // console.log(restored);
    // console.log(`compressed ${compressed.length}`);
    // console.log(`not compressed ${canvasData.length}`);
    const inputBytesCompressed = ethers.utils.isBytesLike(compressed)
      ? compressed
      : ethers.utils.toUtf8Bytes(compressed);
    console.log(`svg ${inputBytesCompressed.length}`);
    sendInput(compressed);
    // sendInput(canvasData);
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
