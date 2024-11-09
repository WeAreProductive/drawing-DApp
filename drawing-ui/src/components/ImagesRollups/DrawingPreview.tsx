import { fabric } from "fabric";
import { useState, useEffect } from "react";
import { CanvasDimensions } from "../../shared/types";
import { INITIAL_DRAWING_OPTIONS } from "../../shared/constants";

const DrawingPreview = ({
  dimensions,
  snapShotJson,
}: {
  dimensions: CanvasDimensions;
  snapShotJson: string;
}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const width = dimensions?.width | INITIAL_DRAWING_OPTIONS.canvasWidth;
    const height = dimensions?.height | INITIAL_DRAWING_OPTIONS.canvasHeight;

    const canvas = new fabric.Canvas(null, {
      width: width,
      height: height,
    });
    canvas.loadFromJSON(snapShotJson, function () {});

    canvas.setDimensions({
      width: width,
      height: height,
    });

    canvas.setWidth(width);
    canvas.setHeight(height);

    canvas.renderAll();
    const generatedSVG = canvas.toSVG();

    const svg = new Blob([generatedSVG], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(svg);
    setUrl(url);
  }, []);
  return <img src={url} alt="drawing preview" />;
};

export default DrawingPreview;
