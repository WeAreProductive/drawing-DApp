import { useEffect, useState } from "react";
import CanvasControls from "../components/CanvasControls";
import DrawingControls from "../components/Drawing/DrawingControls";
import { useCanvasContext } from "../context/CanvasContext";
import { prepareDrawingObjectsArrays, validateInputSize } from "../utils";
import { CanvasLimitations } from "../shared/types";

const Controls = () => {
  const { canvas, currentDrawingData } = useCanvasContext();

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
      // Gets current drawing data
      const canvasContent = canvas.toJSON(); // or canvas.toObject()
      const currentDrawingLayer = prepareDrawingObjectsArrays(
        currentDrawingData,
        canvasContent.objects,
      ); // extracts the currents session drawing objects using the old and current drawing data
      let canvasData = {
        // svg: base64_encode(canvasSVG), // for validation before minting
        content: currentDrawingLayer,
      };
      // validate before sending the tx
      const result = validateInputSize(
        currentDrawingData,
        JSON.stringify(canvasData),
        true,
      );

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
