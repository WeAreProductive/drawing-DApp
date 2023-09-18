import { BASE_API_URL } from "../../shared/constants";
import { useCanvasContext } from "../../context/CanvasContext";
import { parseCanvasData } from "../../utils";
//src is a json string containing the canvas info - json to load on click an filename to display

const CanvasSnapshot = ({ src }) => {
  const { canvas } = useCanvasContext();
  const loadCanvasFromImage = async () => {
    canvas.clear();

    const canvasParsedData = parseCanvasData(src.content);
    canvas.loadFromJSON(canvasParsedData);
  };
  return (
    <div className="canvas-image" onClick={loadCanvasFromImage}>
      <img src={`${BASE_API_URL}/canvas-images/${src.name}.png`} />
    </div>
  );
};

export default CanvasSnapshot;
