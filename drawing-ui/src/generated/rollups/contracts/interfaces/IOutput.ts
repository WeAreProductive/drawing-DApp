/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export type OutputValidityProofStruct = {
  epochIndex: PromiseOrValue<BigNumberish>;
  inputIndex: PromiseOrValue<BigNumberish>;
  outputIndex: PromiseOrValue<BigNumberish>;
  outputHashesRootHash: PromiseOrValue<BytesLike>;
  vouchersEpochRootHash: PromiseOrValue<BytesLike>;
  noticesEpochRootHash: PromiseOrValue<BytesLike>;
  machineStateHash: PromiseOrValue<BytesLike>;
  keccakInHashesSiblings: PromiseOrValue<BytesLike>[];
  outputHashesInEpochSiblings: PromiseOrValue<BytesLike>[];
};

export type OutputValidityProofStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string,
  string,
  string,
  string[],
  string[]
] & {
  epochIndex: BigNumber;
  inputIndex: BigNumber;
  outputIndex: BigNumber;
  outputHashesRootHash: string;
  vouchersEpochRootHash: string;
  noticesEpochRootHash: string;
  machineStateHash: string;
  keccakInHashesSiblings: string[];
  outputHashesInEpochSiblings: string[];
};

export interface IOutputInterface extends utils.Interface {
  functions: {
    "executeVoucher(address,bytes,(uint256,uint256,uint256,bytes32,bytes32,bytes32,bytes32,bytes32[],bytes32[]))": FunctionFragment;
    "getEpochNoticeLog2Size()": FunctionFragment;
    "getEpochVoucherLog2Size()": FunctionFragment;
    "getNoticeMetadataLog2Size()": FunctionFragment;
    "getNumberOfFinalizedEpochs()": FunctionFragment;
    "getVoucherMetadataLog2Size()": FunctionFragment;
    "validateNotice(bytes,(uint256,uint256,uint256,bytes32,bytes32,bytes32,bytes32,bytes32[],bytes32[]))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "executeVoucher"
      | "getEpochNoticeLog2Size"
      | "getEpochVoucherLog2Size"
      | "getNoticeMetadataLog2Size"
      | "getNumberOfFinalizedEpochs"
      | "getVoucherMetadataLog2Size"
      | "validateNotice"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "executeVoucher",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      OutputValidityProofStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getEpochNoticeLog2Size",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getEpochVoucherLog2Size",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getNoticeMetadataLog2Size",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getNumberOfFinalizedEpochs",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVoucherMetadataLog2Size",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "validateNotice",
    values: [PromiseOrValue<BytesLike>, OutputValidityProofStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "executeVoucher",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEpochNoticeLog2Size",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEpochVoucherLog2Size",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNoticeMetadataLog2Size",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNumberOfFinalizedEpochs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVoucherMetadataLog2Size",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateNotice",
    data: BytesLike
  ): Result;

  events: {
    "VoucherExecuted(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "VoucherExecuted"): EventFragment;
}

export interface VoucherExecutedEventObject {
  voucherPosition: BigNumber;
}
export type VoucherExecutedEvent = TypedEvent<
  [BigNumber],
  VoucherExecutedEventObject
>;

export type VoucherExecutedEventFilter = TypedEventFilter<VoucherExecutedEvent>;

export interface IOutput extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IOutputInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    executeVoucher(
      _destination: PromiseOrValue<string>,
      _payload: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    /**
     * Get log2 size of epoch notice memory range
     */
    getEpochNoticeLog2Size(overrides?: CallOverrides): Promise<[BigNumber]>;

    /**
     * Get log2 size of epoch voucher memory range
     */
    getEpochVoucherLog2Size(overrides?: CallOverrides): Promise<[BigNumber]>;

    /**
     * Get log2 size of notice metadata memory range
     */
    getNoticeMetadataLog2Size(overrides?: CallOverrides): Promise<[BigNumber]>;

    /**
     * Get number of finalized epochs
     */
    getNumberOfFinalizedEpochs(overrides?: CallOverrides): Promise<[BigNumber]>;

    /**
     * Get log2 size of voucher metadata memory range
     */
    getVoucherMetadataLog2Size(overrides?: CallOverrides): Promise<[BigNumber]>;

    validateNotice(
      _notice: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  executeVoucher(
    _destination: PromiseOrValue<string>,
    _payload: PromiseOrValue<BytesLike>,
    _v: OutputValidityProofStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  /**
   * Get log2 size of epoch notice memory range
   */
  getEpochNoticeLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

  /**
   * Get log2 size of epoch voucher memory range
   */
  getEpochVoucherLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

  /**
   * Get log2 size of notice metadata memory range
   */
  getNoticeMetadataLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

  /**
   * Get number of finalized epochs
   */
  getNumberOfFinalizedEpochs(overrides?: CallOverrides): Promise<BigNumber>;

  /**
   * Get log2 size of voucher metadata memory range
   */
  getVoucherMetadataLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

  validateNotice(
    _notice: PromiseOrValue<BytesLike>,
    _v: OutputValidityProofStruct,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    executeVoucher(
      _destination: PromiseOrValue<string>,
      _payload: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Get log2 size of epoch notice memory range
     */
    getEpochNoticeLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get log2 size of epoch voucher memory range
     */
    getEpochVoucherLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get log2 size of notice metadata memory range
     */
    getNoticeMetadataLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get number of finalized epochs
     */
    getNumberOfFinalizedEpochs(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get log2 size of voucher metadata memory range
     */
    getVoucherMetadataLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    validateNotice(
      _notice: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "VoucherExecuted(uint256)"(
      voucherPosition?: null
    ): VoucherExecutedEventFilter;
    VoucherExecuted(voucherPosition?: null): VoucherExecutedEventFilter;
  };

  estimateGas: {
    executeVoucher(
      _destination: PromiseOrValue<string>,
      _payload: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    /**
     * Get log2 size of epoch notice memory range
     */
    getEpochNoticeLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get log2 size of epoch voucher memory range
     */
    getEpochVoucherLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get log2 size of notice metadata memory range
     */
    getNoticeMetadataLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get number of finalized epochs
     */
    getNumberOfFinalizedEpochs(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Get log2 size of voucher metadata memory range
     */
    getVoucherMetadataLog2Size(overrides?: CallOverrides): Promise<BigNumber>;

    validateNotice(
      _notice: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    executeVoucher(
      _destination: PromiseOrValue<string>,
      _payload: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    /**
     * Get log2 size of epoch notice memory range
     */
    getEpochNoticeLog2Size(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Get log2 size of epoch voucher memory range
     */
    getEpochVoucherLog2Size(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Get log2 size of notice metadata memory range
     */
    getNoticeMetadataLog2Size(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Get number of finalized epochs
     */
    getNumberOfFinalizedEpochs(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Get log2 size of voucher metadata memory range
     */
    getVoucherMetadataLog2Size(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validateNotice(
      _notice: PromiseOrValue<BytesLike>,
      _v: OutputValidityProofStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}