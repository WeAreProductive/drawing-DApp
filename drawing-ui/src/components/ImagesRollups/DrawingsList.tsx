import { useEffect, useRef } from "react";
import { DrawingInputExtended } from "../../shared/types";
import CanvasSnapshot from "./CanvasSnapshot";

type DrawingsListProp = {
  drawings: DrawingInputExtended[] | null;
  title: string;
};
const DrawingsList = ({ drawings, title }: DrawingsListProp) => {
  const listRefAllDrawings = useRef<HTMLInputElement>(null);
  useEffect(() => {
    listRefAllDrawings.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [drawings]);
  return (
    <div className="list-wrapper">
      <div className="list-header">
        <h5>{title}</h5>
      </div>
      <div className="images-list">
        <div className="images-list-box" ref={listRefAllDrawings}>
          {drawings && drawings.length > 0 ? (
            drawings.map((drawing, idx) => {
              try {
                return (
                  <CanvasSnapshot key={`${drawing.id}-${idx}`} src={drawing} />
                );
              } catch (e) {
                console.log(e);
              }
            })
          ) : (
            <div className="canvas-image">
              Canvas shanpshots will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingsList;
