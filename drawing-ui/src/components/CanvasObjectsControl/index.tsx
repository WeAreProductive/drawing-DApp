import ModeControl from "./ModeControl";
import RemoveControl from "./RemoveControl";
import CanvasUndo from "./CanvasUndo";
import CanvasRedo from "./CanvasRedo";
import CanvasReset from "./CanvasReset";
import { useCanvasControls } from "../../hooks/useCanvasControl";

type CanvasObjectsControlProp = {
  enabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
};
const CanvasObjectsControl = ({
  enabled,
  canUndo,
  canRedo,
}: CanvasObjectsControlProp) => {
  const { isActiveControl, drawingIsClosed } = useCanvasControls();
  return (
    <div className="flex gap-1">
      <ModeControl enabled={enabled} />
      <RemoveControl enabled={enabled} />
      {isActiveControl && !drawingIsClosed && (
        <>
          <CanvasUndo canUndo={canUndo} />
          <CanvasRedo canRedo={canRedo} />
        </>
      )}
      {/*!drawingIsClosed && <CanvasReset />*/}
    </div>
  );
};
export default CanvasObjectsControl;
