import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo } from "react";
import pako from "pako";

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
  // @TODO get actual width and height, add to CanvasSnapshotlight
  const drawingPreview = useMemo(() => {
    const canvas = new fabric.Canvas(null, {
      width: dimensions.width,
      height: dimensions.height,
    });
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    canvas.loadFromJSON(snapShotJson, function () {
      canvas.setZoom(1);

      const group = new fabric.Group(canvas.getObjects());
      const groupLeft = group.left || 0;
      const groupWidth = group.width || 0;
      const groupTop = group.top || 0;
      const groupHeight = group.height || 0;

      const x = groupLeft + groupWidth / 2 - canvasWidth / 2;
      const y = groupTop + groupHeight / 2 - canvasHeight / 2;
      canvas.absolutePan({ x: x, y: y });
      const heightDist = canvas.getHeight() - groupHeight;
      const widthDist = canvas.getWidth() - groupWidth;
      let groupDimension = 0;
      let canvasDimension = 0;

      if (heightDist < widthDist) {
        groupDimension = groupHeight;
        canvasDimension = canvas.getHeight();
      } else {
        groupDimension = groupWidth;
        canvasDimension = canvas.getWidth();
      }

      const zoom = (canvasDimension / groupDimension) * 0.8;
      canvas.zoomToPoint({ x: canvasWidth / 2, y: canvasHeight / 2 }, zoom);
      canvas.renderAll();
    });

    const offsetX = (canvasWidth * 1.05) / 2 || 0;
    const offsetY = (canvasHeight * 1.05) / 2 || 0;
    const generatedSVG = canvas.toSVG({
      viewBox: {
        x: -offsetX,
        y: -offsetY,
        width: canvasWidth * 1.05 || 0,
        height: canvasHeight * 1.05 || 0,
      },
      width: canvasWidth * 1.05 || 0,
      height: canvasHeight * 1.05 || 0,
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
