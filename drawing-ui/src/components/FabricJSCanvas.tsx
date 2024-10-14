import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric"; // v5
import { useCanvasContext } from "../context/CanvasContext";
import { DAPP_STATE, INITIAL_DRAWING_OPTIONS } from "../shared/constants";
import { getCursorSvg, snapShotJsonfromLog } from "../utils";
import { useInspect } from "../hooks/useInspect";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FabricJSCanvas = () => {
  const canvasWrapperEl = useRef<HTMLDivElement>(null);
  const canvasEl = useRef(null);
  // temp error HandHelpingIcon, @TODO remove
  const notify = (message: string) => {
    toast.error(message, {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      onClose: () => (location.href = "/drawing"),
    });
  };
  const { inspectCall } = useInspect();
  const { uuid } = useParams();
  const {
    canvas,
    setDappState,
    setCurrentDrawingData,
    setRedoObjectsArr,
    setCurrentDrawingLayer,
    setCanvas,
    canvasOptions,
  } = useCanvasContext();
  // const { owner, uuid, update_log, dimensions } = src;
  const initCurrentDrawing = async (uuid: string) => {
    const queryStr = `drawing/uuid/${uuid}`;
    const drawingData = await inspectCall(queryStr);
    const { drawings } = drawingData;
    if (!canvas) return;
    if (drawings && drawings.length) {
      const { update_log } = drawings[0];

      const snapShotJson = snapShotJsonfromLog(update_log);
      // //fabricjs.com/fabric-intro-part-3#serialization
      canvas.loadFromJSON(snapShotJson);
      setDappState(DAPP_STATE.drawingUpdate);
      setCurrentDrawingData(drawings[0]);
      setRedoObjectsArr([]);
      setCurrentDrawingLayer([]);
    } else {
      // temp error handling with toaster
      notify(`The drawing you're trying to load doesn't exist!`);
    }
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, INITIAL_DRAWING_OPTIONS);
    // make the fabric.Canvas instance available to your app
    setCanvas(canvas);
    return () => {
      setCanvas(null);
      canvas.dispose();
    };
  }, []);
  useEffect(() => {
    if (!uuid) return;
    initCurrentDrawing(uuid);
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      const brush = canvas.freeDrawingBrush;
      // const brush = canvas.freeDrawingBrush;
      const brushSize =
        canvasOptions.lineWidth || INITIAL_DRAWING_OPTIONS.minBrushWidth;
      brush.color = canvasOptions.color;
      brush.width = brushSize;
      // get cursor by context cursor type
      const getDrawCursor = (cursorType: string) => {
        const cursor = getCursorSvg(brushSize, canvasOptions.color, cursorType);
        if (!cursor) return;
        return `data:image/svg+xml;base64,${window.btoa(cursor)}`;
      };

      // set custom cursor
      const cursor = `url(${getDrawCursor(canvasOptions.cursorType)}) ${brushSize / 2} ${
        brushSize / 2
      }, crosshair`;

      canvas.freeDrawingCursor = cursor;
      canvas.setCursor(cursor);
    }
  }, [canvas, canvasOptions.color, canvasOptions.lineWidth]);

  useEffect(() => {
    if (!canvasWrapperEl.current || !canvas) return;

    const resizeCanvas = () => {
      if (!canvasWrapperEl.current || !canvas) return;

      const { top } = canvasWrapperEl.current.getBoundingClientRect();
      const PADDING = 24;
      const wHeight = window.innerHeight;
      const wWidth = window.innerWidth;
      const availableWidth =
        wWidth -
        parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--sidebar-width")
            .replace("rem", ""),
        ) -
        PADDING * 2;

      const availableHeight = wHeight - top - PADDING;

      var size = Math.min(availableWidth, availableHeight);

      if (size > INITIAL_DRAWING_OPTIONS.canvasWidth)
        size = INITIAL_DRAWING_OPTIONS.canvasWidth;

      canvas.setDimensions({
        width: size,
        height: size,
      });

      canvas.setWidth(size);
      canvas.setHeight(size);

      canvas.renderAll();
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasWrapperEl.current, canvas]);

  return (
    <div ref={canvasWrapperEl} className="flex justify-center">
      <div className="shadow-sm bg-card">
        <canvas
          ref={canvasEl}
          width={canvasOptions.canvasWidth}
          height={canvasOptions.canvasHeight}
        />
        {/* @TODO remove, temp error handling */}
        <ToastContainer
          position="top-center"
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          theme="light"
        />
      </div>
    </div>
  );
};

export default FabricJSCanvas;
