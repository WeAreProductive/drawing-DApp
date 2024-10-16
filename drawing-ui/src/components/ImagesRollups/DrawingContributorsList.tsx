import { Key } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import DrawingPreview from "./DrawingPreview";
import { UpdateLogItem } from "../../shared/types";

const DrawingContributorsList = () => {
  const { currentDrawingData } = useCanvasContext();
  return (
    currentDrawingData && (
      <div className="rounded-xl bg-card p-6">
        <div className="-mx-1 flex flex-wrap">
          {currentDrawingData.update_log.map(
            (element: UpdateLogItem, idx: Key | null | undefined) => {
              // each element is array of `drawing_objects and the painter`
              const { drawing_objects, painter, dimensions } = element;
              const parsedElement = JSON.parse(drawing_objects);
              const snapShotJson = JSON.stringify({
                objects: parsedElement,
              });
              return (
                <div key={idx} className="m-1 border">
                  <DrawingPreview
                    dimensions={dimensions ? JSON.parse(dimensions) : ""}
                    snapShotJson={snapShotJson}
                  />
                  Painter: {painter}
                </div>
              );
            },
          )}
        </div>
      </div>
    )
  );
};

export default DrawingContributorsList;
