import { createContext, useCallback, useContext, useState } from "react";
import { DAPP_STATE, INITIAL_DRAWING_OPTIONS } from "../shared/constants";
import {
  CanvasContextType,
  CanvasOptions,
  DrawingInitialData,
  DrawingInputExtended,
  DrawingObject,
} from "../shared/types";
import { Canvas } from "fabric/fabric-impl";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { ConnectedChain, WalletState } from "@web3-onboard/core";

type Props = {
  children: React.ReactNode;
};
type ConnectionContextType = {
  connectedChain: ConnectedChain | null;
  wallet: WalletState | null;
};
const initialConnectionContext = {
  connectedChain: null,
  wallet: null,
};
const ConnectionContext = createContext<ConnectionContextType>(
  initialConnectionContext,
);

export const useConnectionContext = () => {
  const context = useContext(ConnectionContext);

  if (!context) {
    console.error(
      "Connection context can be used only within a Connection Provider",
    );
  }

  return context;
};

export const ConnectionContextProvider = ({ children }: Props) => {
  const [{ connectedChain }] = useSetChain();
  const [{ wallet }] = useConnectWallet();
  // const [canvas, setCanvas] = useState<Canvas | null>(null);
  // const [canvasOptions, setOptions] = useState<CanvasOptions>(initialOptions);
  // const [dappState, setDappState] = useState<string>(DAPP_STATE.canvasInit);
  // const [currentDrawingData, setCurrentDrawingData] = useState<
  //   DrawingInputExtended | null | DrawingInitialData
  // >(null);

  // // array of objects belonging to the last drawing layer
  // const [currentDrawingLayer, setCurrentDrawingLayer] = useState<
  //   DrawingObject[] | null
  // >(null);
  // // array of objects popped from the current drawing layer with UNDO feat
  // const [redoObjectsArr, setRedoObjectsArr] = useState<DrawingObject[]>([]);
  // const [loading, setLoading] = useState(false);
  // const clearCanvas = useCallback(() => {
  //   if (!canvas) return;
  //   canvas.clear();
  //   canvas.setBackgroundColor(
  //     INITIAL_DRAWING_OPTIONS.backgroundColor,
  //     canvas.renderAll.bind(canvas),
  //   );
  //   setDappState(DAPP_STATE.canvasClear);
  // }, [canvas]);

  const value = {
    connectedChain,
    wallet,
    // canvasOptions,
    // setOptions,
    // dappState,
    // setDappState,
    // currentDrawingData,
    // setCurrentDrawingData,
    // clearCanvas,
    // currentDrawingLayer,
    // setCurrentDrawingLayer,
    // redoObjectsArr,
    // setRedoObjectsArr,
    // loading,
    // setLoading,
  };
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};
