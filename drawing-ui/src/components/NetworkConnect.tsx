import { useConnectWallet } from "@web3-onboard/react";
import { Button } from "./ui/button";
import NetworkWelcome from "./NetworkWelcome";

const NetworkConnect = () => {
  const [{ wallet, connecting }, connect] = useConnectWallet();
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

export default NetworkConnect;
