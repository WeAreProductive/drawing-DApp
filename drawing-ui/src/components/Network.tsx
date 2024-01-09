import { WalletState } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { DAPP_STATE } from "../shared/constants";
import { useCanvasContext } from "../context/CanvasContext";
import { Button } from "./ui/button";
import NetworkWelcome from "./NetworkWelcome";

const Network = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { setDappState, setCurrentDrawingData } = useCanvasContext();
  const handleDisconnect = (wallet: WalletState) => {
    disconnect(wallet);
    setDappState(DAPP_STATE.canvasClear);
    setCurrentDrawingData(null);
  };
  return (
    <div className="flex h-full min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center">
      <NetworkWelcome />
      {!wallet && (
        <Button size="lg" onClick={() => connect()}>
          {connecting ? "connecting" : "Connect wallet"}
        </Button>
      )}
    </div>
  );
};

export default Network;
