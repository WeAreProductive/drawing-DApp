import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";

const CanvasSnapshot = ({ src }: any) => {
  const { canvas } = useCanvasContext();
  const { drawing, owner } = src;
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();
    fabric.loadSVGFromString(src, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();
    });
  };
  return (
    <div>
      <div
        className="canvas-image"
        onClick={loadCanvasFromImage}
        dangerouslySetInnerHTML={{ __html: drawing }}
      />
      <div className="canvas-meta">
        <span className="owner">owner: {owner}</span>
        {/* @TODO decrease onwer address length */}
      </div>
    </div>
  );
};

export default CanvasSnapshot;
