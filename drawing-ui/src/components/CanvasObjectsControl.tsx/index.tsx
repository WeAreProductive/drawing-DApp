import ModeControl from "./ModeControl";
import RemoveControl from "./RemoveControl";

const CanvasObjectsControl = () => {
  return (
    <div className="flex gap-2">
      <ModeControl />
      <RemoveControl />
    </div>
  );
};
export default CanvasObjectsControl;
