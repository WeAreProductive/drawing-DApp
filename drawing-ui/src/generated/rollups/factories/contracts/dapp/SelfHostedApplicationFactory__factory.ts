/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  SelfHostedApplicationFactory,
  SelfHostedApplicationFactoryInterface,
} from "../../../contracts/dapp/SelfHostedApplicationFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IAuthorityFactory",
        name: "authorityFactory",
        type: "address",
      },
      {
        internalType: "contract IApplicationFactory",
        name: "applicationFactory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "authorityOwner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "epochLength",
        type: "uint256",
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
    name: "calculateAddresses",
    outputs: [
      {
        internalType: "address",
        name: "application",
        type: "address",
      },
      {
        internalType: "address",
        name: "authority",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "authorityOwner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "epochLength",
        type: "uint256",
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
    name: "deployContracts",
    outputs: [
      {
        internalType: "contract IApplication",
        name: "application",
        type: "address",
      },
      {
        internalType: "contract IAuthority",
        name: "authority",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getApplicationFactory",
    outputs: [
      {
        internalType: "contract IApplicationFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuthorityFactory",
    outputs: [
      {
        internalType: "contract IAuthorityFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c060405234801561001057600080fd5b5060405161050738038061050783398101604081905261002f9161005e565b6001600160a01b039182166080521660a052610098565b6001600160a01b038116811461005b57600080fd5b50565b6000806040838503121561007157600080fd5b825161007c81610046565b602084015190925061008d81610046565b809150509250929050565b60805160a0516104306100d76000396000818160c5015281816101d1015261032101526000818160530152818161012e015261027c01526104306000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806375689f8314610051578063de4d53fd14610090578063e63d50ff146100c3578063ffc643ca146100e9575b600080fd5b7f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b0390911681526020015b60405180910390f35b6100a361009e366004610384565b6100fc565b604080516001600160a01b03938416815292909116602083015201610087565b7f0000000000000000000000000000000000000000000000000000000000000000610073565b6100a36100f7366004610384565b61024a565b604051631442f7bb60e01b81526001600160a01b038681166004830152602482018690526044820183905260009182917f00000000000000000000000000000000000000000000000000000000000000001690631442f7bb90606401602060405180830381865afa158015610175573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061019991906103d6565b60405163bd4f121960e01b81526001600160a01b038083166004830152878116602483015260448201879052606482018690529192507f00000000000000000000000000000000000000000000000000000000000000009091169063bd4f121990608401602060405180830381865afa15801561021a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061023e91906103d6565b91509550959350505050565b604051631d9324cd60e31b81526001600160a01b038681166004830152602482018690526044820183905260009182917f0000000000000000000000000000000000000000000000000000000000000000169063ec992668906064016020604051808303816000875af11580156102c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102e991906103d6565b604051630e1a07f560e01b81526001600160a01b038083166004830152878116602483015260448201879052606482018690529192507f000000000000000000000000000000000000000000000000000000000000000090911690630e1a07f5906084016020604051808303816000875af115801561021a573d6000803e3d6000fd5b6001600160a01b038116811461038157600080fd5b50565b600080600080600060a0868803121561039c57600080fd5b85356103a78161036c565b94506020860135935060408601356103be8161036c565b94979396509394606081013594506080013592915050565b6000602082840312156103e857600080fd5b81516103f38161036c565b939250505056fea264697066735822122020a143bc4274577e61018885b1497d3d548317895553ccc9ead215bc303b532364736f6c63430008170033";

type SelfHostedApplicationFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SelfHostedApplicationFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SelfHostedApplicationFactory__factory extends ContractFactory {
  constructor(...args: SelfHostedApplicationFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    authorityFactory: PromiseOrValue<string>,
    applicationFactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SelfHostedApplicationFactory> {
    return super.deploy(
      authorityFactory,
      applicationFactory,
      overrides || {}
    ) as Promise<SelfHostedApplicationFactory>;
  }
  override getDeployTransaction(
    authorityFactory: PromiseOrValue<string>,
    applicationFactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      authorityFactory,
      applicationFactory,
      overrides || {}
    );
  }
  override attach(address: string): SelfHostedApplicationFactory {
    return super.attach(address) as SelfHostedApplicationFactory;
  }
  override connect(signer: Signer): SelfHostedApplicationFactory__factory {
    return super.connect(signer) as SelfHostedApplicationFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SelfHostedApplicationFactoryInterface {
    return new utils.Interface(_abi) as SelfHostedApplicationFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SelfHostedApplicationFactory {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SelfHostedApplicationFactory;
  }
}