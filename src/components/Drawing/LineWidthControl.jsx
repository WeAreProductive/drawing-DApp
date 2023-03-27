import { useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
const LineWidthControl = () => {
  const { canvasOptions, setOptions } = useCanvasContext();
  const [lineWidth, setLineWidth] = useState(1);

  const handleLineWidthChange = (e) => {
    setLineWidth(e.target.value);
    setOptions({
      ...canvasOptions,
      lineWidth: lineWidth,
    });
  };
  return (
    <>
      <label htmlFor="drawing-line-width">Line width:</label>
      <span className="info">{lineWidth}</span>
      <input
        type="range"
        value={lineWidth}
        min="0"
        max="150"
        id="drawing-line-width"
        onChange={handleLineWidthChange}
      />
    </>
  );
};

export default LineWidthControl;
