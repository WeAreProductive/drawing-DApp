import { fabric } from "fabric";

export async function validateDrawing(drawingContent, drawingBase64) {
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

        const generatedBase64 = canvas
          .toDataURL({ format: "png" })
          .replace("data:image/png;base64,", "");

        console.log("Input: ", drawingBase64);
        console.log("Generated: ", generatedBase64);

        if (drawingBase64.trim() !== generatedBase64.trim()) return false;
        else return true;
      }
    );
  } catch (error) {
    console.log(error);
  }
}
