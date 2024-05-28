import CanvasReset from "./CanvasReset";
import CanvasToMint from "./CanvasToMint";
import CanvasToSave from "./CanvasToSave";
import CanvasUndo from "./CanvasUndo";
import CanvasRedo from "./CanvasRedo";

type CanvasControlsProp = {
  enabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
};
const CanvasControls = ({ enabled, canUndo, canRedo }: CanvasControlsProp) => {
  return (
    <div className="flex gap-2">
      <CanvasUndo canUndo={canUndo} />
      <CanvasRedo canRedo={canRedo} />
      <CanvasReset />
      <CanvasToSave enabled={enabled} />
      <CanvasToMint enabled={enabled} />
    </div>
  );
};

export default CanvasControls;
