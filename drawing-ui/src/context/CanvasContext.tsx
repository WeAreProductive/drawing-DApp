import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_DRAWING_OPTIONS } from "../shared/constants";
import { CanvasContextType, CanvasOptions } from "../shared/types";
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
  setCanvas: (canvas: null) => undefined,
  canvasOptions: initialOptions,
  setOptions: (options: CanvasOptions) => undefined,
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
  // const [canvasesList, setCanvasesList] = useState([]); //canvases saved as images
  const [canvasOptions, setOptions] = useState<CanvasOptions>(initialOptions);

  const value = {
    canvas,
    setCanvas,
    canvasOptions,
    setOptions,
  };
  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};