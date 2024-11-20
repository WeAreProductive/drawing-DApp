import { Link } from "react-router-dom";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo, useState } from "react";
import DrawingPreview from "./DrawingPreview";
import DrawingStepsPreview from "./DrawingStepsPreview";
import { Layers, MinusCircle } from "lucide-react";
import { useCanvasControls } from "../../hooks/useCanvasControl";
import { useConnectionContext } from "../../context/ConnectionContext";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { owner, uuid, update_log, dimensions, closed_at, contest } = src;
  const { account } = useConnectionContext();
  const { getIsClosedDrawing } = useCanvasControls();
  const { getIsWinner } = useCanvasControls();
  const [showSteps, setShowSteps] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  // @TODO optimise using memo or ...
  const drawingIsClosed = getIsClosedDrawing(closed_at);
  const isWinner = getIsWinner(uuid);
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  const handleShowSteps = () => {
    setShowSteps(!showSteps);
    const label = showSteps ? true : false;
    setShowLabel(label);
  };
  const parsedDimensions = JSON.parse(dimensions);
  return (
    <div className="p-2 border rounded-lg bg-background">
      <Link to={`/drawing/${uuid}`} reloadDocument>
        <div>
          <DrawingPreview
            dimensions={parsedDimensions}
            snapShotJson={snapShotJson}
          />
        </div>
      </Link>

      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
      <span className="block text-xs">
        <b>{src.is_private ? "private" : "public"}</b>
      </span>
      {contest ? (
        <span className="block text-xs">contest: {contest?.title}</span>
      ) : (
        ""
      )}
      {isWinner ? (
        <span className="block text-xs">
          <b>WINNER</b> in the contest
        </span>
      ) : (
        ""
      )}
      <span className="block text-xs">
        {!drawingIsClosed &&
        (!src.is_private ||
          (src.is_private &&
            owner.toLowerCase() == account?.toLocaleLowerCase()))
          ? "Open for drawing"
          : "Drawing is CLOSED"}
      </span>

      <span
        onClick={handleShowSteps}
        className="flex p-1"
        style={{
          width: "24px",
          height: "24px",
          marginLeft: "auto",
          cursor: "pointer",
        }}
      >
        {showLabel ? <Layers /> : <MinusCircle />}
      </span>
      {showSteps ? (
        <DrawingStepsPreview
          dimensions={parsedDimensions}
          updateLog={update_log}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default CanvasSnapshot;
