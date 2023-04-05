import { createContext, useContext, useState, useEffect } from "react";
import { getCanvasImages } from "../services/canvas";
import { INITIAL_DRAWING_OPTIONS } from "../config/constants";

const CanvasContext = createContext();

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    console.error("Canvas context can be used only within a Canvas Provider");
  }

  return context;
};

export const CanvasContextProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);
  const [canvasesList, setCanvasesList] = useState([]); //canvases saved as images
  const [canvasOptions, setOptions] = useState({
    color: INITIAL_DRAWING_OPTIONS.color,
    lineWidth: INITIAL_DRAWING_OPTIONS.brushWidth,
    canvasWidth: INITIAL_DRAWING_OPTIONS.canvasWidth,
    canvasHeight: INITIAL_DRAWING_OPTIONS.canvasHeight,
  });
  // On 1st load and
  // each time a canvas is saved
  // we will update the canvases list
  const manageCanvasesList = async () => {
    const list = await getCanvasImages();
    console.log(list);
    setCanvasesList(list);
  };
  useEffect(() => {
    manageCanvasesList();
  }, []);
  const value = {
    canvas,
    setCanvas,
    canvasOptions,
    setOptions,
    canvasesList,
    manageCanvasesList,
  };
  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
