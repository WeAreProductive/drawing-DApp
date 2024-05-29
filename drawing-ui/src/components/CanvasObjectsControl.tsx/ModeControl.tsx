import { useEffect, useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { Button } from "../ui/button";
import Draw from "../ui/icons/draw";
import Select from "../ui/icons/select";
import { getCursorSvg } from "../../utils";
import {
  CANVAS_CURSOR_TYPES,
  INITIAL_DRAWING_OPTIONS,
} from "../../shared/constants";

const ModeControl = () => {
  const { canvas, canvasOptions } = useCanvasContext();
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
    canvas.on("mouse:dblclick", () => {
      canvas.discardActiveObject();
      canvas.renderAll();

      canvas.isDrawingMode = !canvas.isDrawingMode;
      const brushSize =
        canvasOptions.lineWidth || INITIAL_DRAWING_OPTIONS.minBrushWidth;
      const getDrawCursor = (cursorType: string) => {
        const cursor = getCursorSvg(brushSize, canvasOptions.color, cursorType);
        if (!cursor) return;
        return `data:image/svg+xml;base64,${window.btoa(cursor)}`;
      };
      let cursorType;
      if (canvas.isDrawingMode) {
        cursorType = CANVAS_CURSOR_TYPES.circle;
      } else {
        cursorType = CANVAS_CURSOR_TYPES.select;
      }
      // set custom cursor
      const cursor = `url(${getDrawCursor(cursorType)}) ${brushSize / 2} ${
        brushSize / 2
      }, crosshair`;
      canvas.setCursor(cursor);
      setSelectionEnabled(!canvas.isDrawingMode);
    });

    canvas.on("mouse:down", () => {
      if (canvas.isDrawingMode) return;
      const obj = canvas.getActiveObject();
      if (!obj) return;
      // fabricjs.com/docs/fabric.Object.html#__corner
      obj.set({
        borderScaleFactor: 3,
        // borderColor: "red",
        // cornerColor: "red",
        transparentCorners: false,
        // borderDashArray:
      });
    });

    return () => {
      canvas.removeListeners();
    };
  }, [canvas]);
  return (
    <Button variant={"outline"} onClick={toggleDrawingMode}>
      {selectionEnabled ? <Draw /> : <Select />}
    </Button>
  );
};
export default ModeControl;
