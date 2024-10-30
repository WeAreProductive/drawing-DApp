import { createContext, useContext } from "react";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { ConnectedChain, WalletState } from "@web3-onboard/core";
import { Address, NetworkConfigType } from "../shared/types";

import configFile from "../config/config.json";

const config: { [name: string]: NetworkConfigType } = configFile;

type Props = {
  children: React.ReactNode;
};
type ConnectionContextType = {
  connectedChain: ConnectedChain | null;
  wallet: WalletState | null;
  connectedWallet: any; // @TODO fix typing
  account: `0x${string}` | null;
  dappAddress: Address | null;
  ercToMintAddress: Address | null;
};
const initialConnectionContext = {
  connectedChain: null,
  wallet: null,
  connectedWallet: null,
  account: null,
  dappAddress: null,
  ercToMintAddress: null,
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
  const [connectedWallet] = useWallets();
  const account = connectedWallet?.accounts[0].address;
  const dappAddress = connectedChain
    ? config[connectedChain.id].DAppRelayAddress
    : null;
  const ercToMintAddress = connectedChain
    ? config[connectedChain.id].ercToMint
    : null;
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
    connectedWallet,
    account,
    dappAddress,
    ercToMintAddress,
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
