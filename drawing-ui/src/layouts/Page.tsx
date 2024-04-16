import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import NetworkConnect from "../components/NetworkConnect";
import blocknativeIcon from "../icons/blocknative-icon";

import "../App.css";

import configFile from "../config/config.json";
import Header from "../components/Header";
import { Network } from "../shared/types";
import { toast } from "sonner";
import { useEffect } from "react";
import ToastErrorIcon from "../icons/ToastErrorIcon";

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
  const NetworkRow = (props: { label: string }) => {
    return <li> {props.label}</li>;
  };

  const check = () => {
    if (connectedChain) {
      if (!config[connectedChain?.id]) {
        const supportedNetworks = [];

        for (let ind in config) {
          if (ind !== "0x7a69")
            supportedNetworks.push(
              <NetworkRow label={config[ind].label} key={ind} />,
            );
        }

        toast(
          <>
            <div>
              <ToastErrorIcon />
            </div>
            <div>
              <b>Unsupported network connected!</b>
              <br />
              Please select from the list:
              <ul>{supportedNetworks}</ul>
            </div>
          </>,
          { duration: 5000 },
        );
      }
    }
  };
  useEffect(() => {
    check();
  }, [connectedChain?.id]);
  return (
    <div className="flex h-svh flex-col overflow-auto bg-muted">
      <Header />
      <div className="container max-w-none">
        {wallet ? children : <NetworkConnect />}
      </div>
    </div>
  );
}
