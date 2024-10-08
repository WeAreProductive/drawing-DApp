import { Key } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import DrawingPreview from "./DrawingPreview";

const DrawingContributorsList = () => {
  const { currentDrawingData } = useCanvasContext();

  return (
    currentDrawingData && (
      <div className="rounded-xl bg-card p-6">
        <div className="-mx-1 flex flex-wrap">
          {currentDrawingData.update_log.map(
            (element: string, idx: Key | null | undefined) => {
              // each element is array of `drawing_objects and the painter`
              const parsedElement = JSON.parse(element[0]);
              const snapShotJson = JSON.stringify({
                objects: parsedElement,
              });
              return (
                <div key={idx} className="m-1 border">
                  <DrawingPreview
                    dimensions={JSON.parse(currentDrawingData.dimensions)}
                    snapShotJson={snapShotJson}
                  />
                  Painter: {element[1]}
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
