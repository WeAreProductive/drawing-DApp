import { useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import Draw from "../ui/icons/draw";
import Select from "../ui/icons/select";

const ModeControl = () => {
  const { canvas } = useCanvasContext();
  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const toggleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas?.isDrawingMode;
    setSelectionEnabled(!selectionEnabled);
  };

  return (
    <Button variant={"outline"} onClick={toggleDrawingMode}>
      {selectionEnabled ? <Draw /> : <Select />}
    </Button>
  );
};
export default ModeControl;
