import { useEffect } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import NetworkWelcome from "./NetworkWelcome";
import ReactGA from "react-ga4";
import { GA4_ID } from "../shared/constants";

const Updating = () => {
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
      <h2 className="text-lg font-semibold">Great things coming soon.</h2>
      <p className="mt-4 text-center">
        DrawingCanvas is under update.
        <br />{" "}
        <a href="https://x.com/drawing_canvas" className="underline">
          Follow us on X for news.
        </a>
      </p>
    </div>
  );
};

export default Updating;
