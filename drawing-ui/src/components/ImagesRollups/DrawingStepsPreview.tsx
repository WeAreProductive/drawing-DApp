import { Key } from "react";
import DrawingPreview from "./DrawingPreview";
import { CanvasDimensions } from "../../shared/types";

const DrawingStepsPreview = ({
  updateLog,
  dimensions,
}: {
  updateLog: string[];
  dimensions: CanvasDimensions;
}) => {
  return (
    <div className="drawing-steps">
      {updateLog.map((element: string, idx: Key | null | undefined) => {
        // each element is array of `drawing_objects and the painter`
        const parsedElement = JSON.parse(element[0]);
        const snapShotJson = JSON.stringify({
          objects: parsedElement,
        });
        return (
          <div key={idx} className="m-1 border">
            <DrawingPreview
              dimensions={dimensions}
              snapShotJson={snapShotJson}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DrawingStepsPreview;
