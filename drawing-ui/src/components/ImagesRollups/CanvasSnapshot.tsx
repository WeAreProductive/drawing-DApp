import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";

const CanvasSnapshot = ({ src }: any) => {
  const { canvas } = useCanvasContext();
  const { drawing } = src;
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();
    // https://stackoverflow.com/questions/37563830/fabric-js-load-canvas-from-json
    fabric.loadSVGFromString(src, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();
    });
  };
  return (
    <div
      className="canvas-image"
      onClick={loadCanvasFromImage}
      dangerouslySetInnerHTML={{ __html: drawing }}
    />
  );
};

export default CanvasSnapshot;
