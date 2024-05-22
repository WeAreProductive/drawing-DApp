import { fabric } from "fabric";
import { useState, useEffect } from "react";

const DrawingPreview = ({ dimensions, snapShotJson }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const canvas = new fabric.Canvas(null, {
      width: dimensions.width,
      height: dimensions.height,
    });
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    canvas.loadFromJSON(snapShotJson, function () {
      canvas.setZoom(1);
      const group = new fabric.Group(canvas.getObjects());
      const groupLeft = group.left || 0;
      const groupWidth = group.width || 0;
      const groupTop = group.top || 0;
      const groupHeight = group.height || 0;

      const x = groupLeft + groupWidth / 2 - canvasWidth / 2;
      const y = groupTop + groupHeight / 2 - canvasHeight / 2;
      canvas.absolutePan({ x: x, y: y });
      const heightDist = canvas.getHeight() - groupHeight;
      const widthDist = canvas.getWidth() - groupWidth;
      let groupDimension = 0;
      let canvasDimension = 0;

      if (heightDist < widthDist) {
        groupDimension = groupHeight;
        canvasDimension = canvas.getHeight();
      } else {
        groupDimension = groupWidth;
        canvasDimension = canvas.getWidth();
      }

      const zoom = (canvasDimension / groupDimension) * 0.8;
      canvas.zoomToPoint({ x: canvasWidth / 2, y: canvasHeight / 2 }, zoom);
      canvas.renderAll();
    });

    const offsetX = (canvasWidth * 1.05) / 2 || 0;
    const offsetY = (canvasHeight * 1.05) / 2 || 0;
    const generatedSVG = canvas.toSVG({
      viewBox: {
        x: -offsetX,
        y: -offsetY,
        width: canvasWidth * 1.05 || 0,
        height: canvasHeight * 1.05 || 0,
      },
      width: canvasWidth * 1.05 || 0,
      height: canvasHeight * 1.05 || 0,
    });

    const svg = new Blob([generatedSVG], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(svg);
    setUrl(url);
  }, []);
  return <img src={url} alt="drawing preview" />;
};

export default DrawingPreview;
