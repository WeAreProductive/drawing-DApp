import { useEffect, useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";

const ModeControl = () => {
  const { canvas } = useCanvasContext();
  const [btnLabel, setBtnLabel] = useState("");
  const handleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas?.isDrawingMode;
    canvas.isDrawingMode
      ? setBtnLabel("Enable selecton")
      : setBtnLabel("Disable selection");
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode
      ? setBtnLabel("Enable selecton")
      : setBtnLabel("Disable selection");
  }, [canvas?.isDrawingMode, btnLabel]);
  return <button onClick={handleDrawingMode}>{btnLabel}</button>;
};
export default ModeControl;
