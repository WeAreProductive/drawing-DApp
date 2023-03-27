import { useCanvasContext } from "../../context/CanvasContext";
import { canvasStore } from "../../services/canvas";

const CanvasToJson = () => {
  const { canvas } = useCanvasContext();
  const handleCanvasToJson = async () => {
    const canvasData = JSON.stringify(canvas.toDatalessJSON()); //toDataLessJSON minifies the data
    const resultSave = await canvasStore(canvasData);
    //handle the result or error
    if (resultSave.success) {
      alert("Success saved!");
    } else {
      alert("An error occurred ...");
    }
    //shold we reset the canvas after save?
  };
  return (
    <button
      onClick={handleCanvasToJson}
      title="As json"
      className="button canvas-store">
      Save Canvas
    </button>
  );
};

export default CanvasToJson;
