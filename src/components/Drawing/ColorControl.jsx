import { useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
const ColorControl = () => {
  const { canvasOptions, setOptions } = useCanvasContext();
  const [color, setColor] = useState("#000000");

  const handleColorChange = (e) => {
    setColor(e.target.value);
    setOptions({ ...canvasOptions, color: e.target.value });
  };
  return (
    <div id="drawing-mode-options">
      <label htmlFor="drawing-color">Line color:</label>
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
