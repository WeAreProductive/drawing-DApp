import React, { useEffect, useRef } from "react";
import { fabric } from "fabric"; // v5
import { useCanvasContext } from "../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../shared/constants";
const FabricJSCanvas = () => {
  const canvasEl = useRef(null);
  const { canvas, setCanvas, canvasOptions } = useCanvasContext();

  useEffect(() => {
    const options = {
      isDrawingMode: true,
      backgroundColor: INITIAL_DRAWING_OPTIONS.backgroundColor,
      selectionColor: canvasOptions.color,
      selectionLineWidth: canvasOptions.lineWidth,
    };
    const canvas = new fabric.Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    setCanvas(canvas);
    return () => {
      setCanvas(null);
      canvas.dispose();
    };
  }, []);
  useEffect(() => {
    if (canvas) {
      const brush = canvas.freeDrawingBrush;
      brush.color = canvasOptions.color;
      brush.width =
        canvasOptions.lineWidth || INITIAL_DRAWING_OPTIONS.minBrushWidth;
    }
  }, [canvas, canvasOptions.color, canvasOptions.lineWidth]);
  return (
    <canvas
      ref={canvasEl}
      width={canvasOptions.canvasWidth}
      height={canvasOptions.canvasHeight}
    />
  );
};

export default FabricJSCanvas;
