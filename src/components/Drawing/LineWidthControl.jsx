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
    <div className="drawing-options linewidth-controls">
      <label htmlFor="drawing-line-width" className="control-label">
        Line width:
      </label>
      <div>
        <span className="info">{lineWidth}</span>
        <input
          type="range"
          value={lineWidth}
          min="0"
          max="99"
          id="drawing-line-width"
          onChange={handleLineWidthChange}
        />
      </div>
    </div>
  );
};

export default LineWidthControl;
