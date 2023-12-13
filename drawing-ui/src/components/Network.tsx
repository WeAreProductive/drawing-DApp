import { WalletState } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { DAPP_STATE } from "../shared/constants";
import { useCanvasContext } from "../context/CanvasContext";

const Network = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { setDappState, setCurrentDrawingData } = useCanvasContext();
  const handleDisconnect = (wallet: WalletState) => {
    disconnect(wallet);
    setDappState(DAPP_STATE.canvasClear);
    setCurrentDrawingData(null);
  };
  return (
    <>
      {!wallet ? (
        <button onClick={() => connect()}>
          {connecting ? "connecting" : "connect"}
        </button>
      ) : (
        <button onClick={() => handleDisconnect(wallet)}>
          Disconnect Wallet
        </button>
      )}
    </>
  );
};

export default Network;
