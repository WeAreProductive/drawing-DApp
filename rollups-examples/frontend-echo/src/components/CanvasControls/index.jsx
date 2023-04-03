import CanvasReset from "./CanvasReset";
import CanvasToJson from "./CanvasToSvg";
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
