import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";

const CanvasReset = () => {
  const { canvas, setDappState } = useCanvasContext();
  const handleCanvasClear = () => {
    if (!canvas) return;
    canvas.clear();
    setDappState(DAPP_STATE.canvasClear);
  };
  return (
    <button className="button canvas-reset" onClick={handleCanvasClear}>
      Reset
    </button>
  );
};

export default CanvasReset;
