import { fabric } from "fabric";
import { useState, useEffect } from "react";

const DrawingPreview = ({
  dimensions,
  snapShotJson,
}: {
  dimensions: string;
  snapShotJson: string;
}) => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const parsedDimensions = JSON.parse(dimensions);
    const canvas = new fabric.Canvas(null, {
      width: parsedDimensions?.width | 600,
      height: parsedDimensions?.height | 600,
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
