import { useEffect, useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import { SquareDashedMousePointer, SquarePen } from "lucide-react";

type ModeControlProp = {
  enabled: boolean;
};
const ModeControl = ({ enabled }: ModeControlProp) => {
  const { canvas } = useCanvasContext();
  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const toggleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas?.isDrawingMode;
    setSelectionEnabled(!selectionEnabled);
    canvas.discardActiveObject();
    canvas.renderAll();
  };
  useEffect(() => {
    if (!canvas) return;
    canvas.on("mouse:down", () => {
      if (canvas.isDrawingMode) return;
      const obj = canvas.getActiveObject();
      if (!obj) return;
      // fabricjs.com/docs/fabric.Object.html#__corner
      // make more visible selected object's border and controls
      obj.set({
        borderScaleFactor: 3,
        // borderColor: "red",
        // cornerColor: "red",
        transparentCorners: false,
        // borderDashArray: ...
      });
    });
    return () => {
      canvas.removeListeners();
    };
  }, [canvas]);
  useEffect(() => {
    if (!canvas) return;
    setSelectionEnabled(!canvas.isDrawingMode);
  }, [canvas, canvas?.isDrawingMode]);

  if (!enabled && canvas) canvas.isDrawingMode = true;

  return (
    <Button variant={"outline"} onClick={toggleDrawingMode} disabled={!enabled}>
      {selectionEnabled ? (
        <>
          <SquarePen size={18} className="mr-1" strokeWidth={1.5} />
          <span className="hidden xl:inline-block">Draw</span>
        </>
      ) : (
        <>
          <SquareDashedMousePointer
            size={18}
            className="mr-1"
            strokeWidth={1.5}
          />
          <span className="hidden xl:inline-block">Select</span>
        </>
      )}
    </Button>
  );
};
export default ModeControl;
