import { useEffect } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { Button } from "./ui/button";
import NetworkWelcome from "./NetworkWelcome";
import ReactGA from "react-ga4";
import { GA4_ID } from "../shared/constants";

const NetworkConnect = () => {
  const [{ wallet, connecting }, connect] = useConnectWallet();

  useEffect(() => {
    ReactGA.initialize(GA4_ID);
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Connect Wallet",
    });
  }, []);

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
