import { useEffect, useRef } from "react";
import { fabric } from "fabric"; // v5
import { useCanvasContext } from "../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../shared/constants";

const FabricJSCanvas = () => {
  const canvasWrapperEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef(null);
  const { canvas, setCanvas, canvasOptions } = useCanvasContext();

  useEffect(() => {
    const options = {
      isDrawingMode: true,
      backgroundColor: INITIAL_DRAWING_OPTIONS.backgroundColor,
      // @TODO define as constants
      selectionLineWidth: 2,
      perPixelTargetFind: false,
      preserveObjectStacking: false,
      selection: true,
      selectionBorderColor: "#9f9c9c",
      selectionColor: "transparent",
      selectionFullyContained: true,
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
  }, []);

  useEffect(() => {
    if (canvas) {
      const brush = canvas.freeDrawingBrush;
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

      const size = Math.min(availableWidth, availableHeight);

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
