import { fabric } from "fabric";
import base64 from "base-64";

function stringUnification(str) {
  return Buffer.from(str, "utf-8")
    .toString()
    .replace(/\n|\r|\s/g, "")
    .trim()
    .toLowerCase();
}

export async function validateDrawing(drawingContent, drawingBase64) {
  var res = false;

  try {
    const canvas = new fabric.StaticCanvas(null, { width: 600, height: 600 });
    canvas.loadFromJSON(
      JSON.stringify({ objects: drawingContent }),
      function () {
        canvas.setZoom(1);
        const group = new fabric.Group(canvas.getObjects());
        const x = group.left + group.width / 2 - canvas.width / 2;
        const y = group.top + group.height / 2 - canvas.height / 2;
        canvas.absolutePan({ x: x, y: y });
        const heightDist = canvas.getHeight() - group.height;
        const widthDist = canvas.getWidth() - group.width;
        let groupDimension = 0;
        let canvasDimension = 0;

        if (heightDist < widthDist) {
          groupDimension = group.height;
          canvasDimension = canvas.getHeight();
        } else {
          groupDimension = group.width;
          canvasDimension = canvas.getWidth();
        }

        const zoom = (canvasDimension / groupDimension) * 0.8;
        canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
        canvas.renderAll();

        const generatedSVG = stringUnification(
          canvas.toSVG({
            viewBox: {
              x: 0,
              y: 0,
              width: canvas.width || 0,
              height: canvas.height || 0,
            },
            width: canvas.width || 0,
            height: canvas.height || 0,
          })
        );
        const drawingSVG = stringUnification(base64.decode(drawingBase64));
        if (drawingSVG === generatedSVG) {
          res = true;
        }
      }
    );
  } catch (error) {
    console.log(error);
  }

  return res;
}
