/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IApplicationFactory,
  IApplicationFactoryInterface,
} from "../../../contracts/dapp/IApplicationFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IConsensus",
        name: "consensus",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "appOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "templateHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "contract IApplication",
        name: "appContract",
        type: "address",
      },
    ],
    name: "ApplicationCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IConsensus",
        name: "consensus",
        type: "address",
      },
      {
        internalType: "address",
        name: "appOwner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "templateHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "calculateApplicationAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IConsensus",
        name: "consensus",
        type: "address",
      },
      {
        internalType: "address",
        name: "appOwner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "templateHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "newApplication",
    outputs: [
      {
        internalType: "contract IApplication",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IConsensus",
        name: "consensus",
        type: "address",
      },
      {
        internalType: "address",
        name: "appOwner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "templateHash",
        type: "bytes32",
      },
    ],
    name: "newApplication",
    outputs: [
      {
        internalType: "contract IApplication",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IApplicationFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IApplicationFactoryInterface {
    return new utils.Interface(_abi) as IApplicationFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IApplicationFactory {
    return new Contract(address, _abi, signerOrProvider) as IApplicationFactory;
  }
}