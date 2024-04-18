import { useEffect, useState } from "react";
import CanvasReset from "./CanvasReset";
import CanvasToJSON from "./CanvasToJSON";
import CanvasToSVG from "./CanvasToSVG";
import { useCanvasContext } from "../../context/CanvasContext";
import { toast } from "sonner";
import { validateInputSize } from "../../utils";

const CanvasControls = () => {
  const { canvas } = useCanvasContext();
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
      if (!result.isValid) {
        toast.error(result.info.message);
      }
    };
    // canvas.on("mouse:move", validateCanvasInputSize); not working ..
    canvas.on("after:render", validateCanvasInputSize);
  }, [canvas]);
  return (
    <div className="flex gap-2">
      <CanvasReset />
      <CanvasToSVG />
      <CanvasToJSON />
    </div>
  );
};

export default CanvasControls;
