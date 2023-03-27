import { createContext, useContext, useState } from "react";

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
  const [canvasOptions, setOptions] = useState({
    color: "#000000",
    lineWidth: 1,
    canvasWidth: 600,
    canvasHeight: 600,
  });

  const value = { canvas, setCanvas, canvasOptions, setOptions };
  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
