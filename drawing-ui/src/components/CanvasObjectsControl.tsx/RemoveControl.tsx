import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import Remove from "../ui/icons/remove";
// https://github.com/fabricjs/fabric.js/discussions/6990

type RemoveControlProp = {
  enabled: boolean;
};
const RemoveControl = ({ enabled }: RemoveControlProp) => {
  const { canvas } = useCanvasContext();
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
      <Remove />
    </Button>
  );
};

export default RemoveControl;
