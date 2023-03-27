import { useCanvasContext } from "../../context/CanvasContext";
import { canvasLoad } from "../../services/canvas";
import { parseCanvasData } from "../../utils";
const CanvasFromJson = () => {
  const { canvas, setCanvas } = useCanvasContext();
  const handleCanvasFromJson = async () => {
    const canvasData = await canvasLoad();
    if (canvasData.success) {
      const canvasParsedData = parseCanvasData(canvasData.data);
      canvas.loadFromJSON(canvasParsedData);
    }
  };

  return (
    <button onClick={handleCanvasFromJson} title="from JSON">
      Load Canvas
    </button>
  );
};

export default CanvasFromJson;
