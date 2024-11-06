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

const CanvasToMint = () => {
  const {
    canvas,
    currentDrawingData,
    setLoading,
    loading,
    dappState,
    setDappState,
  } = useCanvasContext();
  const { getVoucherInput } = useDrawing();
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { sendMintingInput } = useRollups(
    config[connectedChain.id].DAppAddress,
  );

  const handleCanvasToMint = async () => {
    console.warn("handle canvas to mint");
    if (!canvas) return;
    if (!currentDrawingData) return;
    const { uuid, owner } = currentDrawingData;
    setLoading(true);
    setDappState(DAPP_STATE.voucherRequest);

    const canvasContent = canvas.toJSON(); // or canvas.toObject()
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

    const input = getVoucherInput(
      uuid,
      drawingMeta,
      config[connectedChain.id].ercToMint,
      config[connectedChain.id].DAppAddress,
    );

    await sendMintingInput(input);
    setLoading(false);
  };
  return connectedChain ? (
    <Button variant={"outline"} onClick={handleCanvasToMint} disabled={loading}>
      <Box size={18} className="mr-2" strokeWidth={1.5} />
      {loading ? " Queuing NFT for minting..." : " Save & Mint NFT"}
    </Button>
  ) : null;
};

export default CanvasToMint;
