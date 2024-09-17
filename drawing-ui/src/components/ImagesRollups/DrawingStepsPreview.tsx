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
      {updateLog.map((element: any, idx: Key | null | undefined) => {
        const parsedElement = JSON.parse(element);
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
