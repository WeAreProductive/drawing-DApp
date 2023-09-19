import { useCanvasContext } from "../../context/CanvasContext";

const CanvasReset = () => {
  const { canvas } = useCanvasContext();
  const handleCanvasClear = () => {
    if (!canvas) return;
    canvas.clear();
  };
  return (
    <button className="button canvas-reset" onClick={handleCanvasClear}>
      Reset
    </button>
  );
};

export default CanvasReset;
