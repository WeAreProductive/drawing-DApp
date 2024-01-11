import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { JsonRpcSigner } from "@ethersproject/providers";
import { ConnectedChain } from "@web3-onboard/core";
import { Network } from "../shared/types";
import {
  InputBox__factory,
  InputBox,
  DAppAddressRelay__factory,
  DAppAddressRelay,
  CartesiDApp__factory,
  CartesiDApp,
  ERC721Portal__factory,
  ERC721Portal,
} from "@cartesi/rollups";

import configFile from "../config/config.json";
const config: { [name: string]: Network } = configFile;

export interface RollupsContracts {
  dappContract: CartesiDApp;
  signer: JsonRpcSigner;
  realyContract: DAppAddressRelay;
  inputContract: InputBox;
  erc721PortalContract: ERC721Portal;
}

export const useRollups = (dAddress: string): RollupsContracts | undefined => {
  const [contracts, setContracts] = useState<RollupsContracts | undefined>();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const [dappAddress] = useState<string>(dAddress);
  useEffect(() => {
    const connect = async (chain: ConnectedChain) => {
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );
      const signer = provider.getSigner();

      let dappRelayAddress = "";
      if (config[chain.id]?.DAppRelayAddress) {
        dappRelayAddress = config[chain.id].DAppRelayAddress;
      } else {
        console.error(
          `No dapp relay address address defined for chain ${chain.id}`
        );
      }

      let inputBoxAddress = "";
      if (config[chain.id]?.InputBoxAddress) {
        inputBoxAddress = config[chain.id].InputBoxAddress;
      } else {
        console.error(
          `No input box address address defined for chain ${chain.id}`
        );
      }

      let erc721PortalAddress = "";
      if (config[chain.id]?.Erc721PortalAddress) {
        erc721PortalAddress = config[chain.id].Erc721PortalAddress;
      } else {
        console.error(
          `No erc721 portal address address defined for chain ${chain.id}`
        );
        alert(`No box erc721 portal address defined for chain ${chain.id}`);
      }

      // dapp contract
      const dappContract = CartesiDApp__factory.connect(dappAddress, signer);
      // relay contract
      const realyContract = DAppAddressRelay__factory.connect(
        dappRelayAddress,
        signer
      );
      // input contract
      const inputContract = InputBox__factory.connect(inputBoxAddress, signer);
      const erc721PortalContract = ERC721Portal__factory.connect(
        erc721PortalAddress,
        signer
      );

      return {
        dappContract,
        signer,
        realyContract,
        inputContract,
        erc721PortalContract,
      };
    };
    if (connectedWallet) {
      if (connectedWallet?.provider && connectedChain) {
        connect(connectedChain).then((contracts) => {
          setContracts(contracts);
        });
      }
    }
  }, [connectedWallet, connectedChain, dappAddress]);
  return contracts;
};
