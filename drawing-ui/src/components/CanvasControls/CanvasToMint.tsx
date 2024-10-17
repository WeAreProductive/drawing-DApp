/**
 * Converts Drawing
 * to json string
 * Sends last drawing layer's data to rollups
 * to request a VOUCHER for minting an NFT
 * and a NOTICE with the current drawing data
 */
import { useCanvasContext } from "../../context/CanvasContext";
import { useSetChain } from "@web3-onboard/react";
import { Button } from "../ui/button";
import { Box } from "lucide-react";
import configFile from "../../config/config.json";
import { storeAsFiles } from "../../services/canvas";
import { Network } from "../../shared/types";
import { useDrawing } from "../../hooks/useDrawing";
import { useRollups } from "../../hooks/useRollups";
import { DAPP_STATE } from "../../shared/constants";

const config: { [name: string]: Network } = configFile;

type CanvasToMintProp = {
  enabled: boolean;
};
const CanvasToMint = ({ enabled }: CanvasToMintProp) => {
  const { canvas, currentDrawingData, setLoading, dappState, setDappState } =
    useCanvasContext();
  const { getVoucherInput } = useDrawing();
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { sendInput } = useRollups(config[connectedChain.id].DAppRelayAddress);

  const handleCanvasToMint = async () => {
    if (!canvas) return;
    if (!currentDrawingData) return;
    const { uuid, owner } = currentDrawingData;
    setLoading(true);
    setDappState(DAPP_STATE.voucherRequest);

    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    // validate before sending the tx @TODO different validation

    // !!!! extracts the !!! currents session !!!! drawing objects using the old and current drawing data
    // const currentDrawingLayerObjects = prepareDrawingObjectsArrays(
    //   currentDrawingData,
    //   canvasContent.objects,
    // ); // extracts the currents session drawing objects using the old and current drawing data
    // let canvasData = {
    //   // svg: base64_encode(canvasSVG), // for validation before minting
    //   content: currentDrawingLayerObjects,
    //   // @TODO uuid is missing from validation
    // };

    // const result = validateInputSize(JSON.stringify(canvasData));

    // if (!result.isValid) {
    //   toast.error(result.info.message, {
    //     description: result.info.description,
    //   });
    //   setLoading(false);
    //   return;
    // }

    const canvasDimensions = {
      width: canvas?.width || 0,
      height: canvas?.height || 0,
    };
    const drawingMeta = await storeAsFiles(
      canvasContent.objects,
      uuid,
      canvasDimensions,
    );
    if (!drawingMeta) return;
    if (!connectedChain) return;

    const strInput = getVoucherInput(
      uuid,
      drawingMeta,
      config[connectedChain.id].ercToMint,
    );

    await sendInput(strInput);
    setLoading(false);
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
