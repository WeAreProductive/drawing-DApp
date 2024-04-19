import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import Remove from "../ui/icons/remove";

const RemoveControl = () => {
  const { canvas } = useCanvasContext();
  const removeActiveObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.remove(active);
  };

  return (
    <Button variant={"outline"} onClick={removeActiveObject}>
      <Remove />
    </Button>
  );
};

export default RemoveControl;
