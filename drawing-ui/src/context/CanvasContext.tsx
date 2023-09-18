import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_DRAWING_OPTIONS } from "../shared/constants";
import { CanvasOptions } from "../shared/types";

type Props = {
  children: React.ReactNode;
};
const CanvasContext = createContext({
  canvas: null,
  setCanvas: () => undefined,
  canvasOptions: {
    color: INITIAL_DRAWING_OPTIONS.color,
    lineWidth: INITIAL_DRAWING_OPTIONS.brushWidth,
    canvasWidth: INITIAL_DRAWING_OPTIONS.canvasWidth,
    canvasHeight: INITIAL_DRAWING_OPTIONS.canvasHeight,
  },
  setOptions: () => undefined,
});

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    console.error("Canvas context can be used only within a Canvas Provider");
  }

  return context;
};

export const CanvasContextProvider = ({ children }: Props) => {
  const [canvas, setCanvas] = useState(null);
  // const [canvasesList, setCanvasesList] = useState([]); //canvases saved as images
  const [canvasOptions, setOptions] = useState<CanvasOptions>({
    color: INITIAL_DRAWING_OPTIONS.color,
    lineWidth: INITIAL_DRAWING_OPTIONS.brushWidth,
    canvasWidth: INITIAL_DRAWING_OPTIONS.canvasWidth,
    canvasHeight: INITIAL_DRAWING_OPTIONS.canvasHeight,
  });

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
