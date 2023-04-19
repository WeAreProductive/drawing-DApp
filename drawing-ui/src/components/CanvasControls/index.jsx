import CanvasReset from "./CanvasReset";
import CanvasToSvg from "./CanvasToSvg";
const CanvasControls = () => {
  return (
    <div className="actions">
      <div>
        <CanvasToSvg />
        <CanvasReset />
      </div>
    </div>
  );
};

export default CanvasControls;
