/**
 * Converts Drawing to json string
 * sends last drawing layer's data
 * to emit a NOTICE with
 * the current drawing data
 */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { InputBox__factory } from "@cartesi/rollups";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import configFile from "../../config/config.json";
import { Network } from "../../shared/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import pako from "pako";
import { validateInputSize, prepareDrawingObjectsArrays } from "../../utils";
import { useDrawing } from "../../hooks/useDrawing";

const config: { [name: string]: Network } = configFile;

type CanvasToSaveProp = {
  enabled: boolean;
};
const CanvasToSave = ({ enabled }: CanvasToSaveProp) => {
  const [connectedWallet] = useWallets();
  const { canvas, dappState, setDappState, currentDrawingData, clearCanvas } =
    useCanvasContext();
  const [{ connectedChain }] = useSetChain();
  const { getNoticeInput } = useDrawing();

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

    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    const currentDrawingLayer = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    ); // extracts the currents session drawing objects using the old and current drawing data
    let canvasData = {
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
    const strInput = getNoticeInput(canvasData, uuid);
    sendInput(strInput);
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
