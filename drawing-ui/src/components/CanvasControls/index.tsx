import CanvasReset from "./CanvasReset";
import CanvasToJSON from "./CanvasToJSON";
import CanvasToSVG from "./CanvasToSVG";

const CanvasControls = () => {
  return (
    <div className="flex gap-2">
      <CanvasReset />
      <CanvasToSVG />
      <CanvasToJSON />
    </div>
  );
};

export default CanvasControls;
