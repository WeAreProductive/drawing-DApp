import { useEffect, useRef } from "react";
import { fabric } from "fabric"; // v5
import { useCanvasContext } from "../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../shared/constants";
import { getCursorSvg } from "../utils";

const FabricJSCanvas = () => {
  const canvasWrapperEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef(null);
  const { canvas, setCanvas, canvasOptions, currentDrawingData } =
    useCanvasContext();

  useEffect(() => {
    const options = {
      isDrawingMode: true,
      backgroundColor: INITIAL_DRAWING_OPTIONS.backgroundColor,
      // @TODO define as constants
      selectionLineWidth: 1,
      perPixelTargetFind: false,
      preserveObjectStacking: false,
      selection: true,
      selectionBorderColor: "#9f9c9c",
      selectionColor: "#9f9c9c",
      selectionFullyContained: true,
      borderScaleFactor: 6,
      // fireRightClick: true, //indicates if the canvas can fire right click events
      // hoverCursor
      interactive: true,
    };
    const canvas = new fabric.Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    setCanvas(canvas);
    return () => {
      setCanvas(null);
      canvas.dispose();
    };
  }, [currentDrawingData]);

  useEffect(() => {
    if (canvas) {
      const brush = canvas.freeDrawingBrush;
      // const brush = canvas.freeDrawingBrush;
      const brushSize =
        canvasOptions.lineWidth || INITIAL_DRAWING_OPTIONS.minBrushWidth;
      brush.color = canvasOptions.color;
      brush.width = brushSize;
      // get cursor by context cursor type
      const getDrawCursor = (cursorType: string) => {
        const cursor = getCursorSvg(brushSize, canvasOptions.color, cursorType);
        if (!cursor) return;
        return `data:image/svg+xml;base64,${window.btoa(cursor)}`;
      };

      // set custom cursor
      const cursor = `url(${getDrawCursor(canvasOptions.cursorType)}) ${brushSize / 2} ${
        brushSize / 2
      }, crosshair`;

      canvas.freeDrawingCursor = cursor;
      canvas.setCursor(cursor);
    }
  }, [canvas, canvasOptions.color, canvasOptions.lineWidth]);

  useEffect(() => {
    if (!canvasWrapperEl.current || !canvas) return;

    const resizeCanvas = () => {
      if (!canvasWrapperEl.current || !canvas) return;

      const { top } = canvasWrapperEl.current.getBoundingClientRect();
      const PADDING = 24;
      const wHeight = window.innerHeight;
      const wWidth = window.innerWidth;
      const availableWidth =
        wWidth -
        parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--sidebar-width")
            .replace("rem", ""),
        ) -
        PADDING * 2;

      const availableHeight = wHeight - top - PADDING;

      var size = Math.min(availableWidth, availableHeight);

      if (size > INITIAL_DRAWING_OPTIONS.canvasWidth)
        size = INITIAL_DRAWING_OPTIONS.canvasWidth;

      canvas.setDimensions({
        width: size,
        height: size,
      });

      canvas.setWidth(size);
      canvas.setHeight(size);

      canvas.renderAll();
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasWrapperEl.current, canvas]);

  return (
    <div
      ref={canvasWrapperEl}
      className="flex justify-center bg-card shadow-sm"
    >
      <canvas
        ref={canvasEl}
        width={canvasOptions.canvasWidth}
        height={canvasOptions.canvasHeight}
      />
    </div>
  );
};

export default FabricJSCanvas;
