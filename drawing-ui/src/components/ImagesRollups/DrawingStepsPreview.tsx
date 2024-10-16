import { Key } from "react";
import DrawingPreview from "./DrawingPreview";
import { CanvasDimensions, UpdateLogItem } from "../../shared/types";

const DrawingStepsPreview = ({
  updateLog,
  dimensions,
}: {
  updateLog: UpdateLogItem[];
  dimensions: CanvasDimensions;
}) => {
  return (
    <div className="drawing-steps">
      {updateLog.map((element: UpdateLogItem, idx: Key | null | undefined) => {
        const { drawing_objects } = element;
        // each element is array of `drawing_objects and the painter`
        const parsedElement = JSON.parse(drawing_objects);
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
