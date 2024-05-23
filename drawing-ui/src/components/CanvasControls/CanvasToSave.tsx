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
  CanvasDimensions,
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
import { validateInputSize, prepareDrawingObjectsArrays } from "../../utils";

const config: { [name: string]: Network } = configFile;

type CanvasToSaveProp = {
  enabled: boolean;
};
const CanvasToSave = ({ enabled }: CanvasToSaveProp) => {
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

  const handleCanvasToSave = async () => {
    if (!canvas) return;

    setLoading(true);

    const sendInput = async (
      drawingMeta: {
        canvasDimensions: CanvasDimensions;
      },
      strInput: string,
    ) => {
      toast.info("Sending input to rollups...");
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
          dimensions: drawingMeta.canvasDimensions,
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload,
          uuid: uuid,
          cmd: COMMANDS.updateAndStore.cmd, // BE will be notified to emit a notice
        });
      } else {
        drawingNoticePayload = {
          drawing: strInput, // FE is responsible for the svg string only
          dimensions: drawingMeta.canvasDimensions,
        };
        str = JSON.stringify({
          drawing_input: drawingNoticePayload, // data to save in a notice
          uuid: uuid,
          cmd: COMMANDS.createAndStore.cmd, // BE will be notified to emit a notice
        });
      }

      // Instantiate the InputBox contract
      const inputBox = InputBox__factory.connect(inputBoxAddress, signer);
      // proceed after validation

      const compressedStr = pako.deflate(str);
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
    // Gets current drawing data as SVG, @TODO - change the validation
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
    // validate before sending the tx
    const result = validateInputSize(canvasSVG);
    if (!result.isValid) {
      toast.error(result.info.message, {
        description: result.info.description,
      });
      setLoading(false);
      return;
    }
    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    const currentDrawingLayer = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    ); // extracts the currents session drawing objects using the old and current drawing data
    let canvasData = {
      content: currentDrawingLayer,
    };
    sendInput(
      {
        canvasDimensions: {
          width: canvas.width || 0,
          height: canvas.height || 0,
        },
      },
      JSON.stringify(canvasData),
    );
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleCanvasToSave}
      disabled={!connectedChain || loading || !enabled}
    >
      <Save size={18} className="mr-2" strokeWidth={1.5} />
      {loading ? "Saving..." : "Save"}
    </Button>
  );
};

export default CanvasToSave;
