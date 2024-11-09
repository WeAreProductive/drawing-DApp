import { Undo } from "lucide-react";
import { Button } from "../ui/button";
import { useCanvasContext } from "../../context/CanvasContext";
type CanvasUndoProp = {
  canUndo: boolean;
};
const CanvasUndo = ({ canUndo }: CanvasUndoProp) => {
  const { canvas, currentDrawingLayer, redoObjectsArr, setRedoObjectsArr } =
    useCanvasContext();
  const handleCanvasUndo = () => {
    if (!currentDrawingLayer) return;
    // [] is truthy, I can undo
    // if only there are drawn by me objects in the current drawing layer
    if (currentDrawingLayer.length < 1) return;
    if (!canvas) return;

    const canvasContentObjects = canvas._objects.pop();
    if (canvasContentObjects)
      setRedoObjectsArr([...redoObjectsArr, canvasContentObjects]);

    canvas.loadFromJSON(JSON.stringify({ objects: canvas._objects }), () => {});
  };
  return (
    <Button
      variant={"ghost"}
      onClick={handleCanvasUndo}
      disabled={!canUndo}
      title="Undo"
    >
      <Undo size={18} strokeWidth={1.5} />
    </Button>
  );
};

export default CanvasUndo;
