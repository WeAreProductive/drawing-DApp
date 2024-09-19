import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import { CanvasDimensions, DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo, useState } from "react";
import DrawingPreview from "./DrawingPreview";
import DrawingStepsPreview from "./DrawingStepsPreview";
import { Layers, MinusCircle } from "lucide-react";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const {
    canvas,
    setDappState,
    setCurrentDrawingData,
    setRedoObjectsArr,
    setCurrentDrawingLayer,
  } = useCanvasContext();
  const { owner, uuid, update_log, dimensions } = src;
  const [showSteps, setShowSteps] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  const loadCanvasFromImage = () => {
    if (!canvas) return;
    //fabricjs.com/fabric-intro-part-3#serialization
    canvas.loadFromJSON(snapShotJson);
    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
    setRedoObjectsArr([]);
    setCurrentDrawingLayer([]);
  };
  const handleShowSteps = () => {
    setShowSteps(!showSteps);
    const label = showSteps ? true : false;
    setShowLabel(label);
  };
  const parsedDimensions: CanvasDimensions = useMemo(() => {
    return JSON.parse(dimensions);
  }, [dimensions]);
  return (
    <div className="p-2 border rounded-lg bg-background">
      <div onClick={loadCanvasFromImage}>
        <DrawingPreview
          dimensions={parsedDimensions}
          snapShotJson={snapShotJson}
        />
      </div>
      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
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
