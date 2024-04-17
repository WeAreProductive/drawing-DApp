import { useEffect, useState } from "react";
import CanvasReset from "./CanvasReset";
import CanvasToJSON from "./CanvasToJSON";
import CanvasToSVG from "./CanvasToSVG";
import { useCanvasContext } from "../../context/CanvasContext";
import { toast } from "sonner";
import { validateInputSize } from "../../utils";

const CanvasControls = () => {
  const { canvas } = useCanvasContext();
  const [svgStrLength, setSvgStrLength] = useState(0); // @TODO temp var, remove
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
      setSvgStrLength(canvasSVG.length); // @TODO remove
      const isValidSize = validateInputSize(canvasSVG);
      if (!isValidSize) {
        toast.error("You are approaching rollups input size limit!");
      }
    };
    // canvas.on("mouse:move", validateCanvasInputSize); not working ..
    canvas.on("after:render", validateCanvasInputSize);
  }, [canvas]);
  return (
    <div className="flex gap-2">
      <p>{svgStrLength}</p>
      <CanvasReset />
      <CanvasToSVG />
      <CanvasToJSON />
    </div>
  );
};

export default CanvasControls;
