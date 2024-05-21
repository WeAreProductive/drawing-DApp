import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE, INITIAL_DRAWING_OPTIONS } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo } from "react";
import { decode as base64_decode } from "base-64";
import pako from "pako";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, setDappState, setCurrentDrawingData } = useCanvasContext();
  const { drawing, owner, uuid, update_log } = src;
  const drawingObj = JSON.parse(drawing);
  const snapShotJson = useMemo(
    () => snapShotJsonfromLog(update_log),
    [update_log],
  );
  // console.log({ update_log });
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();
    //fabricjs.com/fabric-intro-part-3#serialization
    canvas.loadFromJSON(snapShotJson);
    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
  };
  // @TODO get actual width and height, add to CanvasSnapshotlight
  const drawingPreview = useMemo(() => {
    const canvas = new fabric.StaticCanvas(null, { width: 600, height: 600 });
    canvas.loadFromJSON(snapShotJson, function () {
      canvas.setZoom(1);
      const group = new fabric.Group(canvas.getObjects());
      const x = group.left + group.width / 2 - canvas.width / 2;
      const y = group.top + group.height / 2 - canvas.height / 2;
      canvas.absolutePan({ x: x, y: y });
      const heightDist = canvas.getHeight() - group.height;
      const widthDist = canvas.getWidth() - group.width;
      let groupDimension = 0;
      let canvasDimension = 0;

      if (heightDist < widthDist) {
        groupDimension = group.height;
        canvasDimension = canvas.getHeight();
      } else {
        groupDimension = group.width;
        canvasDimension = canvas.getWidth();
      }

      const zoom = (canvasDimension / groupDimension) * 0.8;
      canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
      canvas.renderAll();
    });

    const generatedSVG = canvas.toSVG({
      viewBox: {
        x: -300,
        y: -300,
        width: 600 || 0,
        height: 600 || 0,
      },
      width: 600 || 0,
      height: 600 || 0,
    });

    const svg = new Blob([generatedSVG], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(svg);
    return <img src={url} alt="drawing preview" />;
  }, [snapShotJson]);

  return (
    <div className="rounded-lg border bg-background p-2">
      <div onClick={loadCanvasFromImage}>{drawingPreview}</div>
      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
    </div>
  );
};

export default CanvasSnapshot;
