import { createContext, useContext, useState } from "react";
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

  const value = {
    canvas,
    setCanvas,
    canvasOptions,
    setOptions,
    dappState,
    setDappState,
    currentDrawingData,
    setCurrentDrawingData,
  };
  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
