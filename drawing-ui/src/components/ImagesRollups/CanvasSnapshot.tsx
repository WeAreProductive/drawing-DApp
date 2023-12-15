import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr } from "../../utils";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};
const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, setDappState, setCurrentDrawingData } = useCanvasContext();
  const { drawing, owner } = src;
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();
    fabric.loadSVGFromString(drawing, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();
    });
    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
  };

  return (
    <div className="drawing-wrapper">
      <div
        className="canvas-image"
        onClick={loadCanvasFromImage}
        dangerouslySetInnerHTML={{ __html: drawing }}
      />
      <div className="canvas-meta">
        <span className="owner">owner: {sliceAccountStr(owner)}</span>
      </div>
    </div>
  );
};

export default CanvasSnapshot;
