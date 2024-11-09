import { Redo } from "lucide-react";
import { Button } from "../ui/button";
import { useCanvasContext } from "../../context/CanvasContext";
type CanvasRedoProp = {
  canRedo: boolean;
};
const CanvasRedo = ({ canRedo }: CanvasRedoProp) => {
  const { canvas, redoObjectsArr, setRedoObjectsArr } = useCanvasContext();
  const handleCanvasUndo = () => {
    if (!redoObjectsArr) return;
    if (redoObjectsArr.length < 1) return;
    if (!canvas) return;
    const redo = redoObjectsArr; // copy the state arr
    const objToRedo = redo.pop(); // mutate the redo array
    setRedoObjectsArr([...redo]);
    if (!objToRedo) return;
    canvas._objects.push(objToRedo);
    canvas.loadFromJSON(JSON.stringify({ objects: canvas._objects }), () => {});
  };
  return (
    <Button
      variant={"ghost"}
      onClick={handleCanvasUndo}
      disabled={!canRedo}
      title="Redo"
    >
      <Redo size={18} strokeWidth={1.5} />
    </Button>
  );
};

export default CanvasRedo;
