import { BASE_API_URL } from "../../config/constants";
import { useCanvasContext } from "../../context/CanvasContext";
//src is a json string containing the canvas info - json to load on click an filename to display

const CanvasSnapshot = ({ src }) => {
  const { canvas } = useCanvasContext();
  const loadCanvasFromImage = async () => {
    canvas.clear();
    // fabric.loadSVGFromString(src, function (objects, options) {
    //   var obj = fabric.util.groupSVGElements(objects, options);
    //   canvas.add(obj).renderAll();
    // });
  };
  return (
    <div className="canvas-image" onClick={loadCanvasFromImage}>
      <img src={`${BASE_API_URL}/canvas-images/${src.name}.png`} />
    </div>
  );
};

export default CanvasSnapshot;
