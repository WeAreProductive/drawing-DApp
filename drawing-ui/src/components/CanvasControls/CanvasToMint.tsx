/**
 * Converts Drawing
 * to json string
 * Sends last drawing layer's data to rollups
 * to request a VOUCHER for minting an NFT
 * and a NOTICE with the current drawing data
 */
import { useCanvasContext } from "../../context/CanvasContext";
import { useSetChain } from "@web3-onboard/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Box } from "lucide-react";
import configFile from "../../config/config.json";
import { storeAsFiles } from "../../services/canvas";
import { v4 as uuidv4 } from "uuid";
import { DrawingMeta, Network } from "../../shared/types";
import { prepareDrawingObjectsArrays, validateInputSize } from "../../utils";
import { useDrawing } from "../../hooks/useDrawing";
import { useRollups } from "../../hooks/useRollups";
import { DAPP_STATE } from "../../shared/constants";

const config: { [name: string]: Network } = configFile;

type CanvasToMintProp = {
  enabled: boolean;
};
const CanvasToMint = ({ enabled }: CanvasToMintProp) => {
  const {
    canvas,
    currentDrawingData,
    currentDrawingLayer,
    setLoading,
    dappState,
    setDappState,
  } = useCanvasContext();
  const { getVoucherInput } = useDrawing();
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { sendInput } = useRollups(config[connectedChain.id].DAppRelayAddress);

  const uuid = uuidv4();

  const handleCanvasToMint = async () => {
    if (!canvas) return;

    if (!currentDrawingLayer) return;
    if (currentDrawingLayer.length < 1) return;

    setLoading(true);
    setDappState(DAPP_STATE.voucherRequest);
    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    const currentDrawingLayerObjects = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    ); // extracts the currents session drawing objects using the old and current drawing data
    let canvasData = {
      // svg: base64_encode(canvasSVG), // for validation before minting
      content: currentDrawingLayerObjects,
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
      disabled={!enabled}
    >
      <Box size={18} className="mr-2" strokeWidth={1.5} />
      {dappState == DAPP_STATE.voucherRequest
        ? " Queuing NFT for minting..."
        : " Save & Mint NFT"}
    </Button>
  ) : null;
};

export default CanvasToMint;
