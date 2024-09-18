import { useMemo } from "react";
import { snapShotJsonfromLog } from "../../utils";
import { DrawingInputExtended } from "../../shared/types";
import DrawingPreview from "./DrawingPreview";

type CanvasSnapshotLightProp = {
  data: DrawingInputExtended;
};
const CanvasSnapshotLight = ({ data }: CanvasSnapshotLightProp) => {
  if (!data) return;
  const { update_log, dimensions } = data;
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  return <DrawingPreview dimensions={dimensions} snapShotJson={snapShotJson} />;
};

export default CanvasSnapshotLight;
