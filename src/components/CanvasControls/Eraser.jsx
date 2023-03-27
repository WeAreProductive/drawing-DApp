import { useCanvasContext } from "../../context/CanvasContext";
import { canvasStore } from "../../services/canvas";
//@TODO this button will act as eraser
// display an erase icon on it
const Eraser = () => {
  const { canvas } = useCanvasContext();
  const handleCanvasClear = () => {};
  return (
    <button className="button eraser" onClick={handleCanvasClear}>
      Erase
    </button>
  );
};

export default Eraser;
