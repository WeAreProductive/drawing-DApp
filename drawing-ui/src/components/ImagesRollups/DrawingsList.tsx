import { useEffect, useRef } from "react";
import { DrawingInputExtended } from "../../shared/types";
import CanvasSnapshot from "./CanvasSnapshot";

type DrawingsListProp = {
  drawings: DrawingInputExtended[] | null;
};
const DrawingsList = ({ drawings }: DrawingsListProp) => {
  const listRefAllDrawings = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    listRefAllDrawings.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [drawings]);
  
  return (
    <div ref={listRefAllDrawings} className="-mx-1 flex flex-wrap">
      {drawings && drawings.length > 0 ? (
        drawings.map((drawing, idx) => {
          try {
            return (
              <div key={`${drawing.id}-${idx}`} className="w-1/2 p-2">
                <CanvasSnapshot key={`${drawing.id}-${idx}`} src={drawing} />
              </div>
            );
          } catch (e) {
            console.log(e);
          }
        })
      ) : (
        <div className="p-2">Canvas shanpshots will appear here...</div>
      )}
    </div>
  );
};

export default DrawingsList;
