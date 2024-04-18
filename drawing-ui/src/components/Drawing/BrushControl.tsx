import { useEffect, useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { fabric } from "fabric";
import { INITIAL_DRAWING_OPTIONS } from "../../shared/constants";

const BrushControl = () => {
  const { canvas, canvasOptions } = useCanvasContext();
  const [btnLabel, setBtnLabel] = useState("Spray");
  const [sprayEnabled, setSprayEnabled] = useState(false);

  const handleBrush = () => {
    if (!canvas) return;
    if (!sprayEnabled) {
      canvas.freeDrawingBrush = new fabric["SprayBrush"](canvas);
      const brush = canvas.freeDrawingBrush;
      // const brush = canvas.freeDrawingBrush;
      const brushSize =
        canvasOptions.lineWidth || INITIAL_DRAWING_OPTIONS.minBrushWidth;
      brush.color = canvasOptions.color;
      brush.width = brushSize;

      const getDrawCursor = () => {
        const circle = `
          <svg
            height="${brushSize}"
            fill="${canvasOptions.color}"
            viewBox="0 0 ${brushSize * 2} ${brushSize * 2}"
            width="${brushSize}"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50%"
              cy="50%"
              r="${brushSize}" 
            />
          </svg>
        `;

        return `data:image/svg+xml;base64,${window.btoa(circle)}`;
      };

      // set custom cursor
      const cursor = `url(${getDrawCursor()}) ${brushSize / 2} ${
        brushSize / 2
      }, crosshair`;

      canvas.freeDrawingCursor = cursor;
      canvas.setCursor(cursor);
      setBtnLabel("Default");
      setSprayEnabled(true);
      // @TODO change the cursor
    } else {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      const brush = canvas.freeDrawingBrush;
      // const brush = canvas.freeDrawingBrush;
      const brushSize =
        canvasOptions.lineWidth || INITIAL_DRAWING_OPTIONS.minBrushWidth;
      brush.color = canvasOptions.color;
      brush.width = brushSize;
      // @TODO get proper cursor image
      const getDrawCursor = () => {
        const circle = `
          <svg
            height="${brushSize}"
            fill="${canvasOptions.color}"
            viewBox="0 0 ${brushSize * 2} ${brushSize * 2}"
            width="${brushSize}"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50%"
              cy="50%"
              r="${brushSize}" 
            />
          </svg>
        `;

        return `data:image/svg+xml;base64,${window.btoa(circle)}`;
      };

      // set custom cursor
      const cursor = `url(${getDrawCursor()}) ${brushSize / 2} ${
        brushSize / 2
      }, crosshair`;

      canvas.freeDrawingCursor = cursor;
      canvas.setCursor(cursor);
      setBtnLabel("Spray");
      setSprayEnabled(false);
      // @TODO change the cursor
    }
  };
  useEffect(() => {
    if (sprayEnabled) {
      setBtnLabel("Default");
    } else {
      setBtnLabel("Spray");
    }
  }, [sprayEnabled]);
  return <button onClick={handleBrush}>{btnLabel}</button>;
};

export default BrushControl;
