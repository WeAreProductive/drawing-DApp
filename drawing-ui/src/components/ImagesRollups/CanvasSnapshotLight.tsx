import { useMemo } from "react";
import { snapShotJsonfromLog } from "../../utils";
import { DrawingInputExtended } from "../../shared/types";
import DrawingPreview from "./DrawingPreview";

type CanvasSnapshotLightProp = {
  data: DrawingInputExtended;
};
const CanvasSnapshotLight = ({ data }: CanvasSnapshotLightProp) => {
  if (!data) return;
  const { update_log, dimensions, contest } = data;
  console.log({ contest });
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  const parsedDimensions = useMemo(() => {
    return JSON.parse(dimensions);
  }, [dimensions]);
  return (
    <>
      <DrawingPreview
        dimensions={parsedDimensions}
        snapShotJson={snapShotJson}
      />
      {contest ? <i>from contest: {contest.title}</i> : ""}
    </>
  );
};

export default CanvasSnapshotLight;
