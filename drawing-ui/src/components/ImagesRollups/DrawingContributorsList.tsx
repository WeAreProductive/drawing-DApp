import { Key } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import DrawingPreview from "./DrawingPreview";

const DrawingContributorsList = () => {
  const { currentDrawingData } = useCanvasContext();
  return (
    currentDrawingData && (
      <div className="p-6 rounded-xl bg-card">
        <div className="flex flex-wrap -mx-1">
          {currentDrawingData.update_log.map(
            (element: any, idx: Key | null | undefined) => {
              // each element is array of `drawing_objects and the painter`
              const { drawing_objects, painter } = element;
              const parsedElement = JSON.parse(drawing_objects);
              const snapShotJson = JSON.stringify({
                objects: parsedElement,
              });
              return (
                <div key={idx} className="m-1 border">
                  <DrawingPreview
                    dimensions={JSON.parse(currentDrawingData.dimensions)}
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
