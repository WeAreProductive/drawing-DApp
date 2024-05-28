import CanvasReset from "./CanvasReset";
import CanvasToMint from "./CanvasToMint";
import CanvasToSave from "./CanvasToSave";
import CanvasUndo from "./CanvasUndo";

type CanvasControlsProp = {
  enabled: boolean;
  canUndo: boolean;
};
const CanvasControls = ({ enabled, canUndo }: CanvasControlsProp) => {
  return (
    <div className="flex gap-2">
      <CanvasUndo canUndo={canUndo} />
      <CanvasReset />
      <CanvasToSave enabled={enabled} />
      <CanvasToMint enabled={enabled} />
    </div>
  );
};

export default CanvasControls;
