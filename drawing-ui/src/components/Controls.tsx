import { useEffect, useState } from "react";
import CanvasControls from "../components/CanvasControls";
import DrawingControls from "../components/Drawing/DrawingControls";
import { useCanvasContext } from "../context/CanvasContext";
import { validateInputSize } from "../utils";
import { CanvasLimitations } from "../shared/types";

const Controls = () => {
  const { canvas } = useCanvasContext();

  const [currentResult, setCurrentResult] = useState<CanvasLimitations>({
    isValid: true,
    info: {
      message: "",
      description: "",
      size: "",
      type: "",
    },
  });

  useEffect(() => {
    if (!canvas) return;

    const validateCanvasInputSize = () => {
      // Gets current drawing data as SVG
      const canvasSVG = canvas.toSVG({
        viewBox: {
          x: 0,
          y: 0,
          width: canvas.width || 0,
          height: canvas.height || 0,
        },
        width: canvas.width || 0,
        height: canvas.height || 0,
      });
      const result = validateInputSize(canvasSVG, true);

      setCurrentResult(result);
    };
    canvas.on("mouse:move", validateCanvasInputSize); // sometimes stops working ..
    canvas.on("after:render", validateCanvasInputSize);
  }, [canvas]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <DrawingControls />
        <CanvasControls enabled={currentResult.isValid} />
      </div>
      <div
        className={`mt-3 text-center text-sm ${currentResult.info.type === "warning" ? "text-orange-500" : currentResult.info.type === "error" ? "font-semibold text-red-500" : ""}`}
      >
        {currentResult.info.size} {currentResult.info.message}{" "}
        {currentResult.info.description}
      </div>
    </div>
  );
};

export default Controls;
