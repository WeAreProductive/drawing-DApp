/**
 * Converts Drawing to json string
 * sends last drawing layer's data
 * to emit a NOTICE with
 * the current drawing data
 */
import { useSetChain } from "@web3-onboard/react";
import { useCanvasContext } from "../../context/CanvasContext";
import configFile from "../../config/config.json";
import { Network } from "../../shared/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { validateInputSize, prepareDrawingObjectsArrays } from "../../utils";
import { useDrawing } from "../../hooks/useDrawing";
import { useRollups } from "../../hooks/useRollups";

const config: { [name: string]: Network } = configFile;

type CanvasToSaveProp = {
  enabled: boolean;
};
const CanvasToSave = ({ enabled }: CanvasToSaveProp) => {
  const { canvas, currentDrawingData, currentDrawingLayer } =
    useCanvasContext();
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { sendInput, setLoading, loading } = useRollups(
    config[connectedChain.id].DAppRelayAddress,
  );
  const { getNoticeInput } = useDrawing();
  const uuid = uuidv4();
  const handleCanvasToSave = async () => {
    if (!canvas) return;
    if (!currentDrawingLayer) return;
    if (currentDrawingLayer.length < 1) return;
    setLoading(true);
    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    const currentDrawingLayerObjects = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    ); // extracts the currents session drawing objects using the old and current drawing data
    let canvasData = {
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
