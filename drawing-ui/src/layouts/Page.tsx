import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import NetworkConnect from "../components/NetworkConnect";
import blocknativeIcon from "../icons/blocknative-icon";

import "../App.css";

import configFile from "../config/config.json";
import Header from "../components/Header";
import { Network } from "../shared/types";
import { useEffect, useState } from "react";
import { Ban } from "lucide-react";

const config: { [name: string]: Network } = configFile;

const injected = injectedModule();

init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  wallets: [injected],
  chains: Object.entries(config).map(([k, v], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Drawing DApp",
    icon: blocknativeIcon,
    description: "Demo app for Cartesi Rollups",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
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
  const [{ wallet }] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(true);

  const SupportedNetworks = () => {
    return (
      <div className="flex flex-col items-center">
        <div>
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
    if (connectedChain) {
      if (!config[connectedChain?.id]) setIsSupportedNetwork(false);
      else setIsSupportedNetwork(true);
    }
  }, [connectedChain?.id]);

  return (
    <div className="flex h-svh flex-col overflow-auto bg-muted">
      <Header />
      <div className="container max-w-none">
        {wallet ? (
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
