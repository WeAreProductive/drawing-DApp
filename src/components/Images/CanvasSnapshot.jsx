import { useCanvasContext } from "../../context/CanvasContext";
import { srcToJson, parseCanvasData } from "../../utils";
import { canvasLoad } from "../../services/canvas";

const CanvasSnapshot = ({ src }) => {
  const { canvas } = useCanvasContext();

  const loadCanvasFromImage = async () => {
    //src and canvas .json share the same name
    const canvasSource = srcToJson(src);
    const canvasData = await canvasLoad(canvasSource);
    if (canvasData.success) {
      const canvasParsedData = parseCanvasData(canvasData.data);
      canvas.loadFromJSON(canvasParsedData);
    }
  };
  return (
    <div className="canvas-image" onClick={loadCanvasFromImage}>
      <img src={`./canvas-images/${src}`} />
    </div>
  );
};

export default CanvasSnapshot;
