// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "../config/config.json";

const config = configFile;

const Network = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

  return (
    <>
      {!wallet ? (
        <button onClick={() => connect()}>
          {connecting ? "connecting" : "connect"}
        </button>
      ) : (
        <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
      )}
    </>
  );
};

export default Network;
