/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DebugFacet,
  DebugFacetInterface,
} from "../../../contracts/facets/DebugFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum Result",
        name: "result",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes32[2]",
        name: "claims",
        type: "bytes32[2]",
      },
      {
        indexed: false,
        internalType: "address payable[2]",
        name: "validators",
        type: "address[2]",
      },
    ],
    name: "ClaimReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum Result",
        name: "result",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes32[2]",
        name: "claims",
        type: "bytes32[2]",
      },
      {
        indexed: false,
        internalType: "address payable[2]",
        name: "validators",
        type: "address[2]",
      },
    ],
    name: "DisputeEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "claim",
        type: "bytes32",
      },
    ],
    name: "NewEpoch",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "_erc721Withdrawal",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "_etherWithdrawal",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "_getFeePerClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_getInputDriveSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_validatorIndex",
        type: "uint256",
      },
    ],
    name: "_getNumRedeems",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_getValidators",
    outputs: [
      {
        internalType: "address payable[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_claim",
        type: "bytes32",
      },
    ],
    name: "_onClaim",
    outputs: [
      {
        internalType: "enum Result",
        name: "",
        type: "uint8",
      },
      {
        internalType: "bytes32[2]",
        name: "",
        type: "bytes32[2]",
      },
      {
        internalType: "address payable[2]",
        name: "",
        type: "address[2]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_winner",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_loser",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_winningClaim",
        type: "bytes32",
      },
    ],
    name: "_onDisputeEnd",
    outputs: [
      {
        internalType: "enum Result",
        name: "",
        type: "uint8",
      },
      {
        internalType: "bytes32[2]",
        name: "",
        type: "bytes32[2]",
      },
      {
        internalType: "address payable[2]",
        name: "",
        type: "address[2]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "epochHash",
        type: "bytes32",
      },
    ],
    name: "_onNewEpochOutput",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "_onNewEpochVM",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Phase",
        name: "_phase",
        type: "uint8",
      },
    ],
    name: "_setCurrentPhase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_validatorIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "_setNumClaims",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611348806100206000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c806398f69b161161007157806398f69b16146101795780639d45ceca146101db578063bcb3571a146101e3578063d446e01014610206578063da048e3614610219578063f8a7ea5d1461022c57600080fd5b80631487d4a9146100b957806315afd588146100d75780633672682c146101085780635171c33c1461012a57806357414ee81461013d57806383089f4114610152575b600080fd5b6100c161023f565b6040516100ce9190610fa7565b60405180910390f35b7f844e22529543d6e722c6477171dd50ffe5b412198b92cd9aeea62bbfabe4cc74545b6040519081526020016100ce565b61011b610116366004611010565b6102b2565b6040516100ce93929190611050565b6100fa6101383660046110d8565b6102ec565b61015061014b3660046110f1565b610344565b005b7f943d5d24442f02461445e15c5d7d4a4ef0acb0d32c5d6f6af37a688224991301546100fa565b6101506101873660046110d8565b7f0635ad75fae4d4e8d896461a635d23700076a1c3fd8da26276f18cb1c09ea56780546001810182556000919091527f5a37c7635ca526c8f76c52ec540210850576205b63dbb3612d47df2b54d6918a0155565b6100fa61039d565b6101f66101f1366004611112565b6103bd565b60405190151581526020016100ce565b6101f6610214366004611112565b610434565b610150610227366004611184565b61045e565b61011b61023a3660046111a6565b6104a5565b606060006000805160206112f3833981519152600181018054604080516020808402820181019092528281529394508301828280156102a757602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610289575b505050505091505090565b60006102bc610f89565b6102c4610f89565b6000805160206112f38339815191526102de8187876104e3565b935093509350509250925092565b7f844e22529543d6e722c6477171dd50ffe5b412198b92cd9aeea62bbfabe4cc76546000907f844e22529543d6e722c6477171dd50ffe5b412198b92cd9aeea62bbfabe4cc739061033d90846106f8565b9392505050565b7fd32d7f90491bee81172a406b65f3270d810392fe53bb0379dde8bdd4e624189c8160028111156103775761037761103a565b8160010160106101000a81548163ffffffff021916908363ffffffff1602179055505050565b60006000805160206112f38339815191526103b781610746565b91505090565b604051631d255ae560e21b8152600090309081906374956b94906103e790879087906004016111e2565b6020604051808303816000875af1158015610406573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042a9190611211565b9150505b92915050565b6040516315e55ce560e01b8152600090309081906315e55ce5906103e790879087906004016111e2565b7f8ab37fef2b2e34c4b62ff9948ee661cdcf34e209d7c20f4d1f6e83085e93b1ff546000805160206112f38339815191529061049b9084846107a3565b6003909101555050565b60006104af610f89565b6104b7610f89565b6000805160206112f38339815191526104d281888888610857565b935093509350505b93509350939050565b60006104ed610f89565b6104f5610f89565b836105355760405162461bcd60e51b815260206004820152600b60248201526a656d70747920636c61696d60a81b60448201526064015b60405180910390fd5b61053f8686610a0b565b6105805760405162461bcd60e51b81526020600482015260126024820152711cd95b99195c881b9bdd08185b1b1bddd95960721b604482015260640161052c565b600061058c8787610ab8565b600388015490915060f81c811c600116156105f95760405162461bcd60e51b815260206004820152602760248201527f73656e6465722068616420636c61696d656420696e20746869732065706f6368604482015266206265666f726560c81b606482015260840161052c565b865461060757848755610667565b865485146106675761065b600260405180604001604052808a6000015481526020018881525060405180604001604052806106418c610b97565b6001600160a01b0390811682528b16602090910152610c51565b935093509350506104da565b6106718787610caa565b61067a87610cd5565b6106be576040805180820182528681526000602080830182905283518085019094526001600160a01b038a16845283018190526106b992909190610c51565b6104d2565b6040805180820182528681526000602080830182905283518085019094526001600160a01b038a1684528301526104d29160019190610c51565b60006008821061071a5760405162461bcd60e51b815260040161052c90611233565b600061072b60016340000000611275565b90508061073984601e61128c565b85901c1691505092915050565b600061075182610cf7565b81546000835560038301546001600160f81b031660038401556040518181527fddc860800a99149017c480ec51523bf4143b7215e78956ae5c31e5c568f5383a9060200160405180910390a192915050565b6000600883106107c55760405162461bcd60e51b815260040161052c90611233565b6107d460016340000000611275565b8211156108195760405162461bcd60e51b8152602060048201526013602482015272436c61696d734d61736b204f766572666c6f7760681b604482015260640161052c565b600061082684601e61128c565b61083560016340000000611275565b901b19905084811661084885601e61128c565b9390931b909217949350505050565b6000610861610f89565b610869610f89565b6108738786610d51565b8654840361090d5761088487610cd5565b6108c8576040805180820182528581526000602080830182905283518085019094526001600160a01b038a16845283018190526108c392909190610e30565b610902565b6040805180820182528581526000602080830182905283518085019094526001600160a01b038a1684528301526109029160019190610e30565b925092509250610a01565b600387015460f81c1561096657610902600260405180604001604052808a60000154815260200187815250604051806040016040528061094c8c610b97565b6001600160a01b0390811682528b16602090910152610e30565b8387556109738787610caa565b61097c87610cd5565b6109c0576040805180820182528581526000602080830182905283518085019094526001600160a01b038a16845283018190526109bb92909190610e30565b6109fa565b6040805180820182528581526000602080830182905283518085019094526001600160a01b038a1684528301526109fa9160019190610e30565b9250925092505b9450945094915050565b60006001600160a01b038216610a4f5760405162461bcd60e51b815260206004820152600960248201526806164647265737320360bc1b604482015260640161052c565b60005b6001840154811015610aae57836001018181548110610a7357610a736112ab565b6000918252602090912001546001600160a01b0390811690841603610a9c57600191505061042e565b80610aa6816112c1565b915050610a52565b5060009392505050565b60006001600160a01b038216610afc5760405162461bcd60e51b815260206004820152600960248201526806164647265737320360bc1b604482015260640161052c565b60005b6001840154811015610b5857836001018181548110610b2057610b206112ab565b6000918252602090912001546001600160a01b0390811690841603610b4657905061042e565b80610b50816112c1565b915050610aff565b5060405162461bcd60e51b81526020600482015260136024820152721d985b1a59185d1bdc881b9bdd08199bdd5b99606a1b604482015260640161052c565b600080610ba8836003015460f81c90565b905060005b6001840154811015610c08576001811b821615610bf657836001018181548110610bd957610bd96112ab565b6000918252602090912001546001600160a01b0316949350505050565b80610c00816112c1565b915050610bad565b5060405162461bcd60e51b815260206004820152601c60248201527f4167726565696e672076616c696461746f72206e6f7420666f756e6400000000604482015260640161052c565b6000610c5b610f89565b610c63610f89565b7f495383aed97965c56495cdbadedfe9667a1b028c54d3fc4b5335895146e02b70868686604051610c9693929190611050565b60405180910390a150939492935090919050565b6000610cb68383610ab8565b6003840154909150610cc89082610e75565b8360030181905550505050565b600381015460009060f081901c60ff16610cef8260f81c90565b149392505050565b6000610d07826003015460f81c90565b905060005b6001830154811015610d4c576001811b821615610d3a576003830154610d3490826001610eb3565b60038401555b80610d44816112c1565b915050610d0c565b505050565b7f844e22529543d6e722c6477171dd50ffe5b412198b92cd9aeea62bbfabe4cc7360005b6001840154811015610e2a57836001018181548110610d9657610d966112ab565b6000918252602090912001546001600160a01b0390811690841603610e18576000846001018281548110610dcc57610dcc6112ab565b600091825260209091200180546001600160a01b0319166001600160a01b03929092169190911790556003840154610e049082610f06565b6003850155610e138282610f6c565b610e2a565b80610e22816112c1565b915050610d75565b50505050565b6000610e3a610f89565b610e42610f89565b7f09201c193a07cae1df95ae692cc698685574c942a04514c48a4c3249f38594ff868686604051610c9693929190611050565b600060088210610e975760405162461bcd60e51b815260040161052c90611233565b6000610ea48360f86112da565b6001901b841791505092915050565b600060088310610ed55760405162461bcd60e51b815260040161052c90611233565b6000610ee185856106f8565b90506000610eef84836112da565b9050610efc8686836107a3565b9695505050505050565b600060088210610f285760405162461bcd60e51b815260040161052c90611233565b826000610f368460f86112da565b6001901b19918216919050610f4c8460f06112da565b6001901b19918216919050610f63828560006107a3565b95945050505050565b6003820154610f7d908260006107a3565b82600301819055505050565b60405180604001604052806002906020820280368337509192915050565b6020808252825182820181905260009190848201906040850190845b81811015610fe85783516001600160a01b031683529284019291840191600101610fc3565b50909695505050505050565b80356001600160a01b038116811461100b57600080fd5b919050565b6000806040838503121561102357600080fd5b61102c83610ff4565b946020939093013593505050565b634e487b7160e01b600052602160045260246000fd5b60a081016003851061107257634e487b7160e01b600052602160045260246000fd5b84825260208083018560005b600281101561109b5781518352918301919083019060010161107e565b505050606083018460005b60028110156110cc5781516001600160a01b0316835291830191908301906001016110a6565b50505050949350505050565b6000602082840312156110ea57600080fd5b5035919050565b60006020828403121561110357600080fd5b81356003811061033d57600080fd5b6000806020838503121561112557600080fd5b823567ffffffffffffffff8082111561113d57600080fd5b818501915085601f83011261115157600080fd5b81358181111561116057600080fd5b86602082850101111561117257600080fd5b60209290920196919550909350505050565b6000806040838503121561119757600080fd5b50508035926020909101359150565b6000806000606084860312156111bb57600080fd5b6111c484610ff4565b92506111d260208501610ff4565b9150604084013590509250925092565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b60006020828403121561122357600080fd5b8151801515811461033d57600080fd5b602080825260129082015271696e646578206f7574206f662072616e676560701b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b6000828210156112875761128761125f565b500390565b60008160001904831182151516156112a6576112a661125f565b500290565b634e487b7160e01b600052603260045260246000fd5b6000600182016112d3576112d361125f565b5060010190565b600082198211156112ed576112ed61125f565b50019056fe8ab37fef2b2e34c4b62ff9948ee661cdcf34e209d7c20f4d1f6e83085e93b1fca26469706673582212203626bfc0e7cb742d6ecb5a49f11d34295e4e789fc30e00bea7a7f5a10e30e31864736f6c634300080d0033";

type DebugFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DebugFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DebugFacet__factory extends ContractFactory {
  constructor(...args: DebugFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DebugFacet> {
    return super.deploy(overrides || {}) as Promise<DebugFacet>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DebugFacet {
    return super.attach(address) as DebugFacet;
  }
  override connect(signer: Signer): DebugFacet__factory {
    return super.connect(signer) as DebugFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DebugFacetInterface {
    return new utils.Interface(_abi) as DebugFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DebugFacet {
    return new Contract(address, _abi, signerOrProvider) as DebugFacet;
  }
}