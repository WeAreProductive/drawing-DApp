import { fabric } from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE, INITIAL_DRAWING_OPTIONS } from "../../shared/constants";
import { DrawingInputExtended } from "../../shared/types";
import { sliceAccountStr, snapShotJsonfromLog } from "../../utils";
import { useMemo } from "react";
import { decode as base64_decode } from "base-64";
import pako from "pako";
import { storedDrawingObj } from "../CanvasControls/dev_data/currentDrawingLayer1";
import { currentDrawingObj2 } from "../CanvasControls/dev_data/currentDrawingLayer2";
import { currentDrawingObj3 } from "../CanvasControls/dev_data/currentDrawingLayer3";

type CanvasSnapshotProp = {
  src: DrawingInputExtended;
};

const CanvasSnapshot = ({ src }: CanvasSnapshotProp) => {
  const { canvas, setDappState, setCurrentDrawingData } = useCanvasContext();
  const { drawing, owner, uuid, update_log } = src;
  const drawingObj = JSON.parse(drawing);
  // console.log({ update_log });
  const loadCanvasFromImage = async () => {
    console.log("loading from json..");
    if (!canvas) return;
    canvas.clear();
    const snapShotJson = snapShotJsonfromLog(update_log);
    console.log(storedDrawingObj);
    //fabricjs.com/fabric-intro-part-3#serialization
    canvas.loadFromJSON(snapShotJson);
    // canvas.loadFromJSON(JSON.stringify({ objects: currentDrawingObj2 }));
    // fabric.loadSVGFromString(
    //   base64_decode(drawingObj.svg),
    //   function (objects, options) {
    //     var obj = fabric.util.groupSVGElements(objects, options);
    //     obj.set({
    //       left: 0,
    //       top: 0,
    //       scaleX: canvas.width && obj.width ? canvas.width / obj.width : 1,
    //       scaleY: canvas.height && obj.height ? canvas.height / obj.height : 1,
    //     });

    //     canvas.add(obj).renderAll();
    //   },
    // );

    setDappState(DAPP_STATE.drawingUpdate);
    setCurrentDrawingData(src);
  };

  const drawingPreview = useMemo(() => {
    const svg = new Blob([base64_decode(drawingObj.svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(svg);
    return <img src={url} alt="drawing preview" />;
  }, [drawing]);

  return (
    <div className="p-2 border rounded-lg bg-background">
      <div onClick={loadCanvasFromImage}>{drawingPreview}</div>
      <span className="block text-xs">Owner: {sliceAccountStr(owner)}</span>
      <span className="block text-xs">ID: {uuid}</span>
    </div>
  );
};

export default CanvasSnapshot;
