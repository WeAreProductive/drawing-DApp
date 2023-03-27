import { useState, useEffect } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import CanvasSnapshot from "./CanvasSnapshot";
const ImagesList = () => {
  const [canvasImages, setCanvasImages] = useState([]);
  const { canvasesList } = useCanvasContext();
  useEffect(() => {
    setCanvasImages(canvasesList);
  }, [canvasesList]);

  return (
    <div className="images-list">
      {canvasImages.length > 0 ? (
        canvasImages.map((filename) => <CanvasSnapshot src={filename} />)
      ) : (
        <div className="canvas-image">
          Canvas shanpshots will appear here...
        </div>
      )}
    </div>
  );
};

export default ImagesList;
