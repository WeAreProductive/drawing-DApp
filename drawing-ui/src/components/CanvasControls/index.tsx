import CanvasReset from "./CanvasReset";
import CanvasToJSON from "./CanvasToJSON"; 

const CanvasControls = () => {
  return (
    <div className="actions">
      <div>
        <CanvasToJSON />
        <CanvasReset />
      </div>
    </div>
  );
};

export default CanvasControls;
