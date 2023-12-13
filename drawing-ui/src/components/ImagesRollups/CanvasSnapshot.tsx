import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import { DrawingInput } from "../../shared/types";

type CanvasSnapshotProp = {
  src: DrawingInput;
};
const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, dappState, setDappState, setCurrentDrawingData } =
    useCanvasContext();
  const { drawing, owner } = src;
  console.log({ src });
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
  const sliceAccount = (str: string) => {
    if (!str) return;
    const len = str.length;
    const start = str.slice(0, 3);
    const end = str.slice(len - 5, len - 1);
    return `${start}...${end}`;
  };
  return (
    <div className="drawing-wrapper">
      <div
        className="canvas-image"
        onClick={loadCanvasFromImage}
        dangerouslySetInnerHTML={{ __html: drawing }}
      />
      <div className="canvas-meta">
        <span className="owner">owner: {sliceAccount(owner)}</span>
      </div>
    </div>
  );
};

export default CanvasSnapshot;
