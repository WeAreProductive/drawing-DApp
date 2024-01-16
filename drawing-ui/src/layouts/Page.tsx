import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import Network from "../components/Network";
import blocknativeIcon from "../icons/blocknative-icon"; //@TODO use app's own icon instead

import "../App.css";

import configFile from "../config/config.json";
import Header from "../components/Header";

const config = configFile;

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
  return (
    <div className="flex h-svh flex-col overflow-auto bg-muted">
      <Header />
      <div className="container max-w-none">
        {wallet ? children : <Network />}
      </div>
    </div>
  );
}
