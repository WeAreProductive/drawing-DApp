import { useEffect, useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../../shared/constants";
import { Slider } from "../ui/slider";

const LineWidthControl = () => {
  const { canvasOptions, setOptions } = useCanvasContext();
  const [lineWidth, setLineWidth] = useState(
    INITIAL_DRAWING_OPTIONS.brushWidth,
  );

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLineWidth(parseInt(e.target.value));
  };

  useEffect(() => {
    setOptions({
      ...canvasOptions,
      lineWidth,
    });
  }, [lineWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "[") {
        setLineWidth((prev) => prev - 1);
      } else if (e.key === "]") {
        setLineWidth((prev) => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="drawing-line-width" className="text-sm tabular-nums">
        {lineWidth}
      </label>
      <Slider
        value={[lineWidth]}
        min={1}
        max={100}
        className="w-40"
        onValueChange={([value]) => setLineWidth(value)}
      />
    </div>
  );
};

export default LineWidthControl;
