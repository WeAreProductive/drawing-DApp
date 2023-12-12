import CanvasReset from "./CanvasReset";
import CanvasToJSON from "./CanvasToJSON"; 
import CanvasToSVG from "./CanvasToSVG";

const CanvasControls = () => {
  return (
    <div className="actions">
      <div>
        <CanvasToSVG />
        {/* <CanvasToJSON /> */}
        <CanvasReset />
      </div>
    </div>
  );
};

export default CanvasControls;
