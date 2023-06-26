// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
 

import {
  InputFacet__factory,
  OutputFacet__factory,
  RollupsFacet__factory,
} from "../generated/rollups";
import { JsonRpcProvider } from "@ethersproject/providers";

import configFile from "../config/config.json";

const config = configFile;

const HARDHAT_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";
const HARDHAT_LOCALHOST_RPC_URL = "http://localhost:8545";
const LOCALHOST_DAPP_ADDRESS = "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A";

export const useRollups = () => {
  const [contracts, setContracts] = useState();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const [accountIndex] = useState(0);

  useEffect(() => {
    const connect = async (chain) => {
      //@TODO - This provider is causing the errors!!!
      //replace it with the BattleShips wallet connect system
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );
      console.log(provider);
      // const provider = new JsonRpcProvider(HARDHAT_LOCALHOST_RPC_URL);
      let address = "0x0000000000000000000000000000000000000000"; //zero addr as placeholder

      // if (config[chain.id]?.rollupAddress) {
      //   address = config[chain.id].rollupAddress;
      // } else {
      //   console.error(
      //     `No rollup address interface defined for chain ${chain.id}`
      //   );
      //   alert(`No rollup address interface defined for chain ${chain.id}`);
      // }
      // const signer = ethers.Wallet.fromMnemonic(
      //   HARDHAT_DEFAULT_MNEMONIC,
      //   `m/44'/60'/0'/0/${accountIndex}`
      // ).connect(provider);
      // // rollups contract
      // const rollupsContract = RollupsFacet__factory.connect(
      //   address,
      //   provider.getSigner()
      // );
      // rollups contract
      const rollupsContract = RollupsFacet__factory.connect(
        LOCALHOST_DAPP_ADDRESS,
        provider.getSigner()
      );

      // // input contract
      // const inputContract = InputFacet__factory.connect(
      //   address,
      //   provider.getSigner()
      // );
      const inputContract = InputFacet__factory.connect(
        LOCALHOST_DAPP_ADDRESS,
        provider.getSigner()
      );

      // const outputContract = OutputFacet__factory.connect(
      //   address,
      //   provider.getSigner()
      // );
      const outputContract = OutputFacet__factory.connect(
        LOCALHOST_DAPP_ADDRESS,
        provider.getSigner()
      );

      // // output contract
      // const erc20PortalContract = ERC20PortalFacet__factory.connect(
      //   address,
      //   provider.getSigner()
      // );

      // const etherPortalContract = EtherPortalFacet__factory.connect(
      //   address,
      //   provider.getSigner()
      // );

      return {
        rollupsContract,
        inputContract,
        outputContract,
        // erc20PortalContract,
        // etherPortalContract,
      };
    };
    if (connectedWallet) {
      if (connectedWallet?.provider && connectedChain) {
        connect(connectedChain).then((contracts) => {
          setContracts(contracts);
        });
      }
    }
  }, [connectedWallet, connectedChain]);
  return contracts;
};
