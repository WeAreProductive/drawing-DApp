import { createContext, useCallback, useContext, useState } from "react";
import { DAPP_STATE, INITIAL_DRAWING_OPTIONS } from "../shared/constants";
import {
  CanvasContextType,
  CanvasOptions,
  DrawingInput,
} from "../shared/types";
import { Canvas } from "fabric/fabric-impl";

type Props = {
  children: React.ReactNode;
};

const initialOptions = {
  color: INITIAL_DRAWING_OPTIONS.color,
  lineWidth: INITIAL_DRAWING_OPTIONS.brushWidth,
  canvasWidth: INITIAL_DRAWING_OPTIONS.canvasWidth,
  canvasHeight: INITIAL_DRAWING_OPTIONS.canvasHeight,
  backgroundColor: INITIAL_DRAWING_OPTIONS.backgroundColor,
};
const initialCanvasContext = {
  canvas: null,
  setCanvas: (canvas: Canvas | null) => undefined,
  canvasOptions: initialOptions,
  setOptions: (options: CanvasOptions) => undefined,
  dappState: DAPP_STATE.canvasInit,
  setDappState: (dappState: string) => undefined,
  currentDrawingData: null,
  setCurrentDrawingData: (data: null | DrawingInput) => undefined,
  clearCanvas: () => undefined,
};
const CanvasContext = createContext<CanvasContextType>(initialCanvasContext);

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    console.error("Canvas context can be used only within a Canvas Provider");
  }

  return context;
};

export const CanvasContextProvider = ({ children }: Props) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [canvasOptions, setOptions] = useState<CanvasOptions>(initialOptions);
  const [dappState, setDappState] = useState<string>(DAPP_STATE.canvasInit);
  const [currentDrawingData, setCurrentDrawingData] =
    useState<DrawingInput | null>(null);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.setBackgroundColor(
      INITIAL_DRAWING_OPTIONS.backgroundColor,
      canvas.renderAll.bind(canvas),
    );
    setDappState(DAPP_STATE.canvasClear);
  }, [canvas]);

  const value = {
    canvas,
    setCanvas,
    canvasOptions,
    setOptions,
    dappState,
    setDappState,
    currentDrawingData,
    setCurrentDrawingData,
    clearCanvas,
  };
  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
