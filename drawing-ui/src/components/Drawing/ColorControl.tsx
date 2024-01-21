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
    <div className="relative flex items-center">
      <label
        htmlFor="drawing-color"
        className="relative z-10 mr-2 inline-block h-6 w-6 cursor-pointer rounded-full bg-gray-200"
        style={{ backgroundColor: color }}
      >
        <span className="sr-only">Change color</span>
      </label>
      <input
        type="color"
        value={color}
        id="drawing-color"
        className="absolute inset-0 -z-0 h-6 w-6 overflow-hidden opacity-0"
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorControl;
