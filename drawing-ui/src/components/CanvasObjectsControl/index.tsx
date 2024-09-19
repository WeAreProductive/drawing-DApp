import ModeControl from "./ModeControl";
import RemoveControl from "./RemoveControl";

type CanvasObjectsControlProp = {
  enabled: boolean;
};
const CanvasObjectsControl = ({ enabled }: CanvasObjectsControlProp) => {
  return (
    <div className="flex gap-2">
      <ModeControl enabled={enabled} />
      <RemoveControl enabled={enabled} />
    </div>
  );
};
export default CanvasObjectsControl;
