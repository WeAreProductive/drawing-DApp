import { useEffect, useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../../config/constants";
import { HexColorPicker } from "react-colorful";
const ColorControl = () => {
  const { canvasOptions, setOptions } = useCanvasContext();
  const [color, setColor] = useState(INITIAL_DRAWING_OPTIONS.color);

  useEffect(() => {
    setOptions({ ...canvasOptions, color: color });
  }, [color, canvasOptions.color]);
  console.log(color);

  return (
    <div className="drawing-options color-controls">
      <HexColorPicker color={color} onChange={setColor} />;
    </div>
  );
};

export default ColorControl;
