/**
 * Converts Drawing
 * to json string
 * Sends last drawing layer's data to rollups
 * to request a VOUCHER for minting an NFT
 * and a NOTICE with the current drawing data
 */
import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import { Box } from "lucide-react";
import { storeAsFiles } from "../../services/canvas";
import { useDrawing } from "../../hooks/useDrawing";
import { useRollups } from "../../hooks/useRollups";
import { DAPP_STATE } from "../../shared/constants";
import { useConnectionContext } from "../../context/ConnectionContext";

const CanvasToMint = () => {
  const { canvas, currentDrawingData, setLoading, loading, setDappState } =
    useCanvasContext();
  const { connectedChain, dappAddress, ercToMintAddress } =
    useConnectionContext();
  const { getVoucherInput } = useDrawing();
  const { sendMintingInput } = useRollups();

  const handleCanvasToMint = async () => {
    console.warn("Canvas :: handle canvas to mint");
    if (!canvas) return;
    if (!currentDrawingData) return;
    const { uuid } = currentDrawingData;
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
    if (!drawingMeta || !ercToMintAddress || !dappAddress) {
      console.warn("Get Voucher Input :: required data is missing");
      return;
    }

    const input = getVoucherInput(
      uuid,
      drawingMeta,
      ercToMintAddress,
      dappAddress,
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
