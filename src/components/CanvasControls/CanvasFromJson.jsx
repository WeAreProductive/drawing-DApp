import { useCanvasContext } from "../../context/CanvasContext";
import { canvasLoad } from "../../services/canvas";
import { parseCanvasData } from "../../utils";
const CanvasFromJson = () => {
  const { canvas } = useCanvasContext();
  const handleCanvasFromJson = async () => {
    const canvasData = await canvasLoad();
    if (canvasData.success) {
      const canvasParsedData = parseCanvasData(canvasData.data);
      canvas.loadFromJSON(canvasParsedData);
    }
  };

  return (
    <button
      onClick={handleCanvasFromJson}
      title="from JSON"
      className="button canvas-load">
      Load Canvas
    </button>
  );
};

export default CanvasFromJson;
