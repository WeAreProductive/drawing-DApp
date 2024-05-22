import { fabric } from "fabric";
import { useState, useEffect } from "react";

const DrawingPreview = ({ dimensions, snapShotJson }: any) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const canvas = new fabric.Canvas(null, {
      width: dimensions.width,
      height: dimensions.height,
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
