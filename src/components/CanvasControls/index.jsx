import CanvasReset from "./CanvasReset";
import CanvasFromJson from "./CanvasFromJson";
import CanvasToJson from "./CanvasToJson";
import Eraser from "./Eraser";
const CanvasControls = () => {
  return (
    <div className="actions">
      <div>
        <Eraser />
        <CanvasReset />
      </div>
      <div>
        <CanvasToJson />
        <CanvasFromJson />
      </div>
    </div>
  );
};

export default CanvasControls;
