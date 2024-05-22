import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo } from "react";
import DrawingPreview from "./DrawingPreview";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, setDappState, setCurrentDrawingData } = useCanvasContext();
  const { owner, uuid, update_log, dimensions } = src;
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();
    //fabricjs.com/fabric-intro-part-3#serialization
    canvas.loadFromJSON(snapShotJson);
    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
  };

  return (
    <div className="rounded-lg border bg-background p-2">
      <div onClick={loadCanvasFromImage}>
        <DrawingPreview dimensions={dimensions} snapShotJson={snapShotJson} />
      </div>
      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
    </div>
  );
};

export default CanvasSnapshot;
