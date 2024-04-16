import { Trash2 } from "lucide-react";
import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
const CanvasReset = () => {
  const { clearCanvas } = useCanvasContext();
  const handleCanvasClear = () => {
    clearCanvas();
  };
  return (
    <Button variant={"ghost"} onClick={handleCanvasClear}>
      <Trash2 size={18} className="mr-2" strokeWidth={1.5} />
      Clear
    </Button>
  );
};

export default CanvasReset;
