import { Key } from "react";
import DrawingPreview from "./DrawingPreview";

const DrawingStepsPreview = ({ updateLog, dimensions }: any) => {
  return (
    <div className="drawing-steps">
      {updateLog.map(
        (element: { drawing_objects: any }, idx: Key | null | undefined) => {
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
        },
      )}
    </div>
  );
};

export default DrawingStepsPreview;
