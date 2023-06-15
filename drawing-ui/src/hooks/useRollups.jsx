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
  // OutputFacet__factory,
  RollupsFacet__factory,
  //   ERC20PortalFacet__factory,
  //   EtherPortalFacet__factory,
} from "@cartesi/rollups";

// import {
//   InputFacet__factory,
//   OutputFacet__factory,
//   RollupsFacet__factory,
//   ERC20PortalFacet__factory,
//   EtherPortalFacet__factory,
// } from "../generated/rollups";

import configFile from "../config/config.json";

const config = configFile;

export const useRollups = () => {
  const [contracts, setContracts] = useState();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();

  useEffect(() => {
    const connect = async (chain) => {
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider
      );

      let address = "0x0000000000000000000000000000000000000000"; //zero addr as placeholder

      if (config[chain.id]?.rollupAddress) {
        address = config[chain.id].rollupAddress;
      } else {
        console.error(
          `No rollup address interface defined for chain ${chain.id}`
        );
        alert(`No rollup address interface defined for chain ${chain.id}`);
      }

      // rollups contract
      const rollupsContract = RollupsFacet__factory.connect(
        address,
        provider.getSigner()
      );

      // input contract
      const inputContract = InputFacet__factory.connect(
        address,
        provider.getSigner()
      );

      // const outputContract = OutputFacet__factory.connect(
      //   address,
      //   provider.getSigner()
      // );

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
        // outputContract,
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
