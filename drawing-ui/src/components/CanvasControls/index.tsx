import CanvasReset from "./CanvasReset";
import CanvasToMint from "./CanvasToMint";
import CanvasToSave from "./CanvasToSave";

type CanvasControlsProp = {
  enabled: boolean;
};
const CanvasControls = ({ enabled }: CanvasControlsProp) => {
  return (
    <div className="flex gap-2">
      <CanvasReset />
      <CanvasToSave enabled={enabled} />
      <CanvasToMint enabled={enabled} />
    </div>
  );
};

export default CanvasControls;
