import { useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../../shared/constants";
const ColorControl = () => {
  const { canvasOptions, setOptions } = useCanvasContext();
  const [color, setColor] = useState(INITIAL_DRAWING_OPTIONS.color);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setOptions({ ...canvasOptions, color: e.target.value });
  };
  return (
    <div className="drawing-options color-controls">
      <label htmlFor="drawing-color" className="control-label">
        Line color:
      </label>
      <input
        type="color"
        value={color}
        id="drawing-color"
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorControl;
