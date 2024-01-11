import ColorControl from "./ColorControl";
import LineWidthControl from "./LineWidthControl";
const DrawingControls = () => {
  return (
    <div className="flex items-center gap-2">
      <ColorControl />
      <LineWidthControl />
    </div>
  );
};

export default DrawingControls;
