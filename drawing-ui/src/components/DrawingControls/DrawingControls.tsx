import BrushControl from "./BrushControl";
import ColorControl from "./ColorControl";
import LineWidthControl from "./LineWidthControl";
const DrawingControls = () => {
  return (
    <div className="flex items-center gap-1">
      <ColorControl />
      <LineWidthControl />
      <BrushControl />
    </div>
  );
};

export default DrawingControls;
