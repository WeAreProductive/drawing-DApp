import { useCanvasContext } from "../../context/CanvasContext";
import { canvasStore } from "../../services/canvas";

const CanvasToJson = () => {
  const { canvas, manageCanvasesList } = useCanvasContext();
  const handleCanvasToJson = async () => {
    const canvasData = JSON.stringify(canvas.toDatalessJSON()); //toDataLessJSON minifies the data
    const resultSave = await canvasStore(canvasData);
    console.log(JSON.stringify(canvas.toSVG()), "canvas to svg");
    // @TODO - send as svg
    // @TODO - load from svg
    //@TODO steps - copy rollups examples to a new branch
    //@TODO - remove the unused folders
    //@TODO - don-t forget to reset the docker containers
    //handle the result or error
    if (resultSave.success) {
      alert("Success saved!");
      //force canvas images list update
      manageCanvasesList();
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
