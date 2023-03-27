import CanvasReset from "./CanvasReset";
import CanvasToJson from "./CanvasToJson";
const CanvasControls = () => {
  return (
    <div className="actions">
      <div>
        <CanvasToJson />
        <CanvasReset />
      </div>
    </div>
  );
};

export default CanvasControls;
