import ColorControl from "./ColorControl";
import LineWidthControl from "./LineWidthControl";
const DrawingControls = () => {
  return (
    <div className="drawing-ui">
      <ColorControl />
      <LineWidthControl />
    </div>
  );
};

export default DrawingControls;
