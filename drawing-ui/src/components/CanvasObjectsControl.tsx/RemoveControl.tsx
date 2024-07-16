import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import { Eraser } from "lucide-react";
// https://github.com/fabricjs/fabric.js/discussions/6990

type RemoveControlProp = {
  enabled: boolean;
};
const RemoveControl = ({ enabled }: RemoveControlProp) => {
  const { canvas } = useCanvasContext();

  if (canvas && !canvas.getActiveObject()) enabled = false;

  const removeActiveObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.remove(active);
  };

  return (
    <Button
      variant={"outline"}
      onClick={removeActiveObject}
      disabled={!enabled}
    >
      <Eraser size={18} className="mr-1" strokeWidth={1.5} />
      Remove Selected
    </Button>
  );
};

export default RemoveControl;
