import { createContext, useContext, useState, useEffect } from "react";
import { getCanvasImages } from "../services/canvas";

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
    color: "#000000",
    lineWidth: 1,
    canvasWidth: 600,
    canvasHeight: 600,
  });
  // On 1st load and
  // each time a canvas is saved
  // we will update the canvases list
  const manageCanvasesList = async () => {
    const list = await getCanvasImages();
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
