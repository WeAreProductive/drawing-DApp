import { Key } from "react";
import DrawingPreview from "./DrawingPreview";
import { CanvasDimensions, UpdateLog, UpdateLogItem } from "../../shared/types";

const DrawingStepsPreview = ({
  updateLog,
  dimensions,
}: {
  updateLog: UpdateLog;
  dimensions: CanvasDimensions;
}) => {
  return (
    <div className="drawing-steps">
      {updateLog.map((element: UpdateLogItem, idx: Key | null | undefined) => {
        const snapShotJson = JSON.stringify({
          objects: element.drawing_objects,
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
