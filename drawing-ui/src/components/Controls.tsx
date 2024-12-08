import { useEffect, useState } from "react";
import CanvasControls from "../components/CanvasControls";
import DrawingControls from "./DrawingControls/DrawingControls";
import CanvasObjectsControl from "./CanvasObjectsControl";
import { useCanvasContext } from "../context/CanvasContext";
import { prepareDrawingObjectsArrays, validateInputSize } from "../utils";
import {
  CanvasLimitations,
  DrawingInitialData,
  DrawingInputExtended,
} from "../shared/types";
import { useCanvasControls } from "../hooks/useCanvasControl";
import CountdownTimer from "./Drawing/CountdownTimer";
import CanvasShare from "./CanvasControls/CanvasShare";

const Controls = () => {
  const {
    canvas,
    currentDrawingData,
    currentDrawingLayer,
    setCurrentDrawingLayer,
    redoObjectsArr,
    setRedoObjectsArr,
    loading,
  } = useCanvasContext();

  const { isActiveControl, drawingIsClosed } = useCanvasControls();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [currentResult, setCurrentResult] = useState<CanvasLimitations>({
    isValid: true,
    info: {
      message: "",
      description: "",
      size: "",
      type: "",
    },
  });
  const { getIsWinner } = useCanvasControls();
  const isWinner = currentDrawingData
    ? getIsWinner(currentDrawingData?.uuid)
    : null; // @TODO optimise with memo or ....

  const validateCanvasInputSize = (
    currentDrawingData: DrawingInputExtended | DrawingInitialData | null,
  ) => {
    if (!canvas) return;
    // Gets current drawing data
    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    const currentDrawingLayerObjects = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    ); // extracts the currents session drawing objects using the old and current drawing data
    setCurrentDrawingLayer(currentDrawingLayerObjects); // enable only if current drawing layer is not empty
    let canvasData = {
      // svg: base64_encode(canvasSVG), // for validation before minting
      content: currentDrawingLayerObjects,
    };
    // validate before sending the tx
    const result = validateInputSize(
      // currentDrawingData,
      JSON.stringify(canvasData),
      true,
    );
    setCurrentResult(result);
  };
  const resetRedoObjectsArr = () => {
    setRedoObjectsArr([]);
  };
  useEffect(() => {
    canvas?.on("mouse:move", () => validateCanvasInputSize(currentDrawingData)); // sometimes stops working ..
    canvas?.on("after:render", () =>
      validateCanvasInputSize(currentDrawingData),
    );
    canvas?.on("path:created", resetRedoObjectsArr);
  }, [currentDrawingData, canvas]);

  useEffect(() => {
    if (!currentDrawingLayer) return;
    currentDrawingLayer.length < 1 ? setCanUndo(false) : setCanUndo(true); // enable only if current drawing layer is not empty
  }, [currentDrawingLayer]);

  useEffect(() => {
    if (!redoObjectsArr) return;
    redoObjectsArr.length < 1 ? setCanRedo(false) : setCanRedo(true);
  }, [redoObjectsArr]);

  return (
    <div className="flex flex-col items-start">
      {currentDrawingData && currentDrawingData.title && (
        <div className="mb-2 xl:mb-4">
          <h1 className="mb-2 inline-block text-xl font-semibold">
            <span className="mr-2 rounded-lg bg-slate-200 px-2 py-1 text-xs font-normal xl:mr-3">
              {currentDrawingData.is_private ? "private" : "public"}
            </span>
            {currentDrawingData.title}
          </h1>
          {currentDrawingData?.contest ? (
            <div>Contest: {currentDrawingData.contest.title}</div>
          ) : (
            ""
          )}
          {isWinner ? (
            <div>
              <b>WINNER</b> in the contest
            </div>
          ) : (
            ""
          )}
          {currentDrawingData.description && (
            <p className="ml-4 inline-block text-sm text-gray-500">
              {currentDrawingData.description}
            </p>
          )}
        </div>
      )}
      <div className="flex w-full flex-col items-center gap-2 md:flex-row md:gap-1">
        {isActiveControl && !drawingIsClosed && (
          <div className="flex flex-col items-center gap-2 md:!flex-row md:gap-1">
            <DrawingControls />
            <CanvasObjectsControl
              enabled={
                currentResult.isValid &&
                !!currentDrawingLayer?.length &&
                !loading
              }
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>
        )}
        <div className="flex grow flex-row justify-end gap-4">
          <CanvasControls
            enabled={
              currentResult.isValid && !!currentDrawingLayer?.length && !loading
            }
            // @TODO will depend on
            canDownload={currentDrawingData ? true : false}
          />
          {currentDrawingData && (
            <CanvasShare currentDrawingData={currentDrawingData} />
          )}
        </div>
      </div>
      <div
        className={`mt-3 w-full text-center text-sm ${currentResult.info.type === "warning" ? "text-orange-500" : currentResult.info.type === "error" ? "font-semibold text-red-500" : ""}`}
      >
        {currentResult.info.size} {currentResult.info.message}{" "}
        {currentResult.info.description}
        <br className="sm:hidden" />
        <CountdownTimer />
      </div>
    </div>
  );
};

export default Controls;
