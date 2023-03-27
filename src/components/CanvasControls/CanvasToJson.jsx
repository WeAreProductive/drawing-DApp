import { useCanvasContext } from "../../context/CanvasContext";
import { canvasStore } from "../../services/canvas";

const CanvasToJson = () => {
  const { canvas } = useCanvasContext();
  const handleCanvasToJson = async () => {
    const canvasData = JSON.stringify(canvas.toDatalessJSON()); //toDataLessJSON minifies the data
    const resultSave = await canvasStore(canvasData);
    //hadle the result
    if (resultSave.success) {
      alert("Success saved!");
    } else {
      alert("An error occurred ...");
    }
    //shold we reset the canvas after save?
  };
  return (
    <button onClick={handleCanvasToJson} title="As json">
      Save Canvas
    </button>
  );
};

export default CanvasToJson;
