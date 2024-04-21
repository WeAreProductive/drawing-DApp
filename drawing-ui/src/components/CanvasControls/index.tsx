import CanvasReset from "./CanvasReset";
import CanvasToJSON from "./CanvasToJSON";
import CanvasToSVG from "./CanvasToSVG";

type CanvasControlsProp = {
  enabled: boolean;
};
const CanvasControls = ({ enabled }: CanvasControlsProp) => {
  return (
    <div className="flex gap-2">
      <CanvasReset />
      <CanvasToSVG enabled={enabled} />
      <CanvasToJSON enabled={enabled} />
    </div>
  );
};

export default CanvasControls;
