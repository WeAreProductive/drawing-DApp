import { createContext, useContext } from "react";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { ConnectedChain, WalletState } from "@web3-onboard/core";
import { Address, Network } from "../shared/types";

import configFile from "../config/config.json";

const config: { [name: string]: Network } = configFile;

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
    ? config[connectedChain.id]?.DAppAddress
      ? config[connectedChain.id].DAppAddress
      : null
    : null;
  const ercToMintAddress = connectedChain
    ? config[connectedChain.id]?.ercToMint
      ? config[connectedChain.id].ercToMint
      : null
    : null;

  const value = {
    connectedChain,
    wallet,
    connectedWallet,
    account,
    dappAddress,
    ercToMintAddress,
  };
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};
