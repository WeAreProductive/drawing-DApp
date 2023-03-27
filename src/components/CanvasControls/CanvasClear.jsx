import { useCanvasContext } from "../../context/CanvasContext";
import { canvasStore } from "../../services/canvas";

const CanvasClear = () => {
  const { canvas } = useCanvasContext();
  const handleCanvasClear = () => {};
  return (
    <button className="button clear-button" onClick={handleCanvasClear}>
      Clear
    </button>
  );
};

export default CanvasClear;
