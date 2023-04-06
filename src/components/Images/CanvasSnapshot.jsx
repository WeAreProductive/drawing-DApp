import { useCanvasContext } from "../../context/CanvasContext";

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
