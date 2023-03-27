import CanvasClear from "./CanvasClear";
import CanvasFromJson from "./CanvasFromJson";
import CanvasToJson from "./CanvasToJson";
import Eraser from "./Eraser";
const CanvasControls = () => {
  return (
    <div className="actions">
      <div>
        <Eraser />
        <CanvasClear />
      </div>
      <div>
        <CanvasToJson />
        <CanvasFromJson />
      </div>
    </div>
  );
};

export default CanvasControls;
