import { useCanvasControls } from "../../hooks/useCanvasControl";
import ModeControl from "./ModeControl";
import RemoveControl from "./RemoveControl";

type CanvasObjectsControlProp = {
  enabled: boolean;
};
const CanvasObjectsControl = ({ enabled }: CanvasObjectsControlProp) => {
  const { isActiveControl } = useCanvasControls();
  return isActiveControl ? (
    <div className="flex gap-2">
      <ModeControl enabled={enabled} />
      <RemoveControl enabled={enabled} />
    </div>
  ) : (
    <div></div>
  );
};
export default CanvasObjectsControl;
