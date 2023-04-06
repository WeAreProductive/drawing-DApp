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
      <div className="images-list-box">
        {canvasImages.length > 0 ? (
          canvasImages.map(({ _id, content }) => {
            return <CanvasSnapshot key={_id} src={content} />;
          })
        ) : (
          <div className="canvas-image">
            Canvas shanpshots will appear here...
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesList;
