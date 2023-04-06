import { useCanvasContext } from "../../context/CanvasContext";
import { srcToJson, parseCanvasData } from "../../utils";
import { canvasLoad } from "../../services/canvas";

const CanvasSnapshot = ({ src }) => {
  const { canvas } = useCanvasContext();
  const loadCanvasFromImage = async () => {
    canvas.clear();
    fabric.loadSVGFromString(src, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();
    });
  };
  return (
    <div
      className="canvas-image"
      onClick={loadCanvasFromImage}
      dangerouslySetInnerHTML={{ __html: src }}
    />
  );
};

export default CanvasSnapshot;
