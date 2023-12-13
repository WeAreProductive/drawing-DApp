import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";

const CanvasSnapshot = ({ src }: any) => {
  const { canvas, dappState, setDappState, setCurrentDrawingData } =
    useCanvasContext();
  const { drawing, owner } = src;
  const loadCanvasFromImage = async () => {
    console.log(src);
    if (!canvas) return;
    canvas.clear();
    fabric.loadSVGFromString(drawing, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();
    });
    setDappState(DAPP_STATE.DRAWING_UPDATE);
    setCurrentDrawingData(src);
  };
  const sliceAccount = (str: string) => {
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
