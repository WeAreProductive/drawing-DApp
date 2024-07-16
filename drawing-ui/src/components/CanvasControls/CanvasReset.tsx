import { Trash2 } from "lucide-react";
import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
const CanvasReset = () => {
  const { clearCanvas, setRedoObjectsArr, canvas } = useCanvasContext();
  const handleCanvasClear = () => {
    if (!canvas) return;
    if (!canvas.isDrawingMode) {
      canvas.isDrawingMode = true;
    }
    clearCanvas();
    setRedoObjectsArr([]);
  };
  return (
    <Button variant={"ghost"} onClick={handleCanvasClear}>
      <Trash2 size={18} className="mr-2" strokeWidth={1.5} />
      Clear All
    </Button>
  );
};

export default CanvasReset;
