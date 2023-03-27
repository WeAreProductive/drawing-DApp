import { useCanvasContext } from "../../context/CanvasContext";
const CanvasFromJson = () => {
  const { canvas, setCanvas } = useCanvasContext();
  const handleCanvasFromJson = () => {
    // canvas.loadFromJSON(JSON.stringify({ objects: data.objects }));
  };

  return (
    <button onClick={handleCanvasFromJson} title="from JSON">
      Load Canvas
    </button>
  );
};

export default CanvasFromJson;
