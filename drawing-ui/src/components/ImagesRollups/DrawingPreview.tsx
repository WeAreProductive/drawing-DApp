import { fabric } from "fabric";
import { useState, useEffect } from "react";
import { CanvasDimensions } from "../../shared/types";

const DrawingPreview = ({
  dimensions,
  snapShotJson,
}: {
  dimensions: CanvasDimensions;
  snapShotJson: string;
}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const canvas = new fabric.Canvas(null, {
      width: dimensions?.width | 600,
      height: dimensions?.height | 600,
    });
    canvas.loadFromJSON(snapShotJson, function () {});

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
