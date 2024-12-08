import { Link } from "react-router-dom";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo } from "react";
import DrawingPreview from "./DrawingPreview";
import { useCanvasControls } from "../../hooks/useCanvasControl";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { owner, uuid, update_log, dimensions, closed_at } = src;
  const { getIsClosedDrawing } = useCanvasControls();
  const drawingIsClosed = getIsClosedDrawing(closed_at);
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  const parsedDimensions = JSON.parse(dimensions);
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-2">
      <Link to={`/drawing/${uuid}`} reloadDocument>
        <div>
          <DrawingPreview
            dimensions={parsedDimensions}
            snapShotJson={snapShotJson}
          />
        </div>
      </Link>

      <div className="text-lg font-semibold">
        <span className="rounded-lg bg-slate-200 px-2 py-1 text-xs font-normal">
          {src.is_private ? "private" : "public"}
        </span>{" "}
        {src.contest ? (
          <span className="block text-xs">contest: {src.contest.title}</span>
        ) : (
          ""
        )}
        {src.title}
      </div>
      <div className="text-xs">
        {/*drawingIsClosed ? "Drawinsg is CLOSED" : "Open for drawing"*/}
      </div>
      <div className="text-xs">Owner: {sliceAccountStr(owner)}</div>
      <div></div>
    </div>
  );
};

export default CanvasSnapshot;
