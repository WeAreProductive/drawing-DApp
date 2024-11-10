import { useEffect, useState } from "react";
import { init } from "@web3-onboard/react";
import metamaskSDK from "@web3-onboard/metamask";
import injectedModule from "@web3-onboard/injected-wallets";
import wagmi from "@web3-onboard/wagmi";
import { useConnectionContext } from "../context/ConnectionContext";
import drawingCanvasLogo from "../icons/drawingcanvas-logo";
import configFile from "../config/config.json";
import Header from "../components/Header";
import { Network } from "../shared/types";
import { Ban } from "lucide-react";
import NetworkWelcome from "../components/NetworkWelcome";
import NetworkConnect from "../components/NetworkConnect";
import ReactGA from "react-ga4";
import { GA4_ID } from "../shared/constants";
import "../App.css";

const config: { [name: string]: Network } = configFile;

const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    dappMetadata: {
      name: "DrawingCanvas",
    },
  },
});

const injected = injectedModule();

init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  wagmi,
  wallets: [metamaskSDKWallet, injected],
  chains: Object.entries(config).map(([k, v], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "DrawingCanvas",
    icon: drawingCanvasLogo,
    description:
      "Drawing Canvas: A digital space for onchain creativity, where users can create collaborative artwork, co-monetize drawings with NFTs, enter contests, and have fun.",
  },
  accountCenter: {
    desktop: {
      position: "topRight",
      enabled: true,
      minimal: true,
    },
    mobile: {
      enabled: true,
    },
  },
});
type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  const { wallet, connectedChain } = useConnectionContext();
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(false);

  const SupportedNetworks = () => {
    useEffect(() => {
      ReactGA.initialize(GA4_ID);
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
        title: "Unsupported Chain",
      });
    }, []);

    return (
      <div className="mt-16 flex flex-col items-center">
        <NetworkWelcome />
        <div className="mt-8">
          <Ban size={48} className="mr-2" strokeWidth={2} color="#c91d1d" />
        </div>
        <div>
          <h3 className="py-6 text-center text-2xl font-bold">
            Unsupported network connected!
          </h3>
          <p className="text-lg">Please select from the list:</p>
          <ul className="list-inside list-disc">
            {Object.keys(config).map(
              (key, i) =>
                key !== "0x7a69" && (
                  <li className="font-semibold" key={i}>
                    {config[key].label}
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIsSupportedNetwork(
      connectedChain && config[connectedChain.id] ? true : false,
    );
  }, [connectedChain]);

  console.log("Connected Chain:", connectedChain);

  return (
    <div className="flex h-svh flex-col overflow-auto bg-muted">
      {wallet && isSupportedNetwork && <Header />}
      <div className="container max-w-none">
        {connectedChain ? (
          isSupportedNetwork ? (
            children
          ) : (
            <SupportedNetworks />
          )
        ) : (
          <NetworkConnect />
        )}
      </div>
    </div>
  );
}
