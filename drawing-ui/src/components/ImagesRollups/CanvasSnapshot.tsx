import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo, useState } from "react";
import DrawingPreview from "./DrawingPreview";
import DrawingStepsPreview from "./DrawingStepsPreview";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, setDappState, setCurrentDrawingData } = useCanvasContext();
  const { owner, uuid, update_log, dimensions } = src;
  const [showSteps, setShowSteps] = useState(false);
  const [showLabel, setShowLabel] = useState("view");
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();
    //fabricjs.com/fabric-intro-part-3#serialization
    canvas.loadFromJSON(snapShotJson, function () {});
    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
  };
  const handleShowSteps = () => {
    setShowSteps(!showSteps);
    const label = showSteps ? "view" : "hide";
    setShowLabel(label);
  };

  return (
    <div className="rounded-lg border bg-background p-2">
      <div onClick={loadCanvasFromImage}>
        <DrawingPreview
          dimensions={dimensions}
          snapShotJson={snapShotJson}
          log={update_log}
        />
      </div>
      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
      <a href="#" onClick={handleShowSteps}>
        {showLabel}
      </a>
      {showSteps ? (
        <DrawingStepsPreview dimensions={dimensions} updateLog={update_log} />
      ) : (
        ""
      )}
    </div>
  );
};

export default CanvasSnapshot;
