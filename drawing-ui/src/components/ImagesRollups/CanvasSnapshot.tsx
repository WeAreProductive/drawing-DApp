import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE, INITIAL_DRAWING_OPTIONS } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr } from "../../utils";
import { useMemo } from "react";
import { decode as base64_decode } from "base-64";
import pako from "pako";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, setDappState, setCurrentDrawingData } = useCanvasContext();
  const { drawing, owner, uuid } = src;

  const decompressed = JSON.parse(pako.inflate(drawing, { to: "string" }));
  const loadCanvasFromImage = async () => {
    if (!canvas) return;
    canvas.clear();

    fabric.loadSVGFromString(
      // base64_decode(JSON.parse(drawing).svg),
      base64_decode(decompressed.svg),
      function (objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        obj.set({
          left: 0,
          top: 0,
          scaleX: canvas.width && obj.width ? canvas.width / obj.width : 1,
          scaleY: canvas.height && obj.height ? canvas.height / obj.height : 1,
        });

        canvas.add(obj).renderAll();
      },
    );

    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
  };

  const drawingPreview = useMemo(() => {
    // const svg = new Blob([base64_decode(JSON.parse(drawing).svg)], {
    const svg = new Blob([base64_decode(decompressed.svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(svg);
    return <img src={url} alt="drawing preview" />;
  }, [decompressed]);

  return (
    <div className="rounded-lg border bg-background p-2">
      <div onClick={loadCanvasFromImage}>{drawingPreview}</div>
      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
    </div>
  );
};

export default CanvasSnapshot;
