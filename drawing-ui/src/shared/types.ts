import { Canvas } from "fabric/fabric-impl";
import { JsonRpcSigner } from "@ethersproject/providers";
import { InputBox, Application, ERC721Portal } from "@cartesi/rollups";
import { Dispatch, SetStateAction } from "react";
import { EtherPortal } from "../generated/rollups";
import { Moment } from "moment";

export type Network = {
  token: string;
  label: string;
  rpcUrl: string;
  graphqlAPIURL: string;
  inspectAPIURL: string;
  nonceAPIURL: string;
  inputSubmitAPIURL: string;
  DAppAddress: string;
  InputBoxAddress: string;
  Erc721PortalAddress: string;
  etherPortalAddress: string;
  ercToMint: string;
  verifyingContract: string;
};

export type CanvasLimitations = {
  isValid: boolean;
  info: {
    message: string;
    description: string;
    size: string;
    type: string;
  };
};

export type CanvasOptions = {
  color: string;
  lineWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  cursorType: string;
};

export type CanvasContextType = {
  canvas: Canvas | null;
  setCanvas: React.Dispatch<Canvas | null>;
  canvasOptions: CanvasOptions;
  setOptions: React.Dispatch<CanvasOptions>;
  dappState: string;
  setDappState: React.Dispatch<string>;
  currentDrawingData: null | DrawingInputExtended | DrawingInitialData;
  setCurrentDrawingData: React.Dispatch<
    null | DrawingInputExtended | DrawingInitialData
  >;

  clearCanvas: () => void;
  currentDrawingLayer: null | DrawingObject[];
  setCurrentDrawingLayer: React.Dispatch<DrawingObject[]>;
  redoObjectsArr: DrawingObject[];
  setRedoObjectsArr: React.Dispatch<DrawingObject[]>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export type VoucherExtended = {
  info: string;
  id?: string;
  index: number;
  destination: string;
  input: any; //{index: number; epoch: {index: number; }
  payload: string;
  erc721string?: null | string;
  ownerAddress?: null | string;
  proof?: any;
  executed?: any;
  msg?: string;
  drawingUUID?: string;
  events?: any;
  selector?: string;
};
// sent Drawings data
export interface DrawingInput {
  drawing: string;
  dimensions: CanvasDimensions;
}
// @TODO typing?

// received Drawings data
export interface DrawingInputExtended extends Omit<DrawingInput, "dimensions"> {
  uuid: string;
  owner: `0x${string}`; //last painter's account
  title?: string;
  description?: string;
  update_log: any; //@TODO typing?!
  voucher_requested?: boolean;
  date_created?: string; // date-time string
  last_updated?: string;
  closed_at?: string;
  dimensions: string;
  minting_price: any;
  private: 0 | 1;
}
export type DrawingUserInput = {
  title: string;
  description: string;
  minting_price: string;
  private: boolean;
  open: number;
  [key: string]: string | boolean | number;
};
// @TODO combine DrawingInitial & DrawingInputExtended & DrawingInput
export type DrawingInitialData = {
  uuid: string;
  owner: string;
  title?: string;
  private?: 0 | 1;
  description?: string;
  dimensions: string;
  minting_price: any;
  update_log: UpdateLog;
  userInputData: DrawingUserInput;
};

export type DrawingObject = { [key: string]: any };
export type UpdateLogItem = {
  date_updated?: string;
  painter?: string;
  action?: string;
  drawing_objects: string;
  dimensions?: string;
};
export type UpdateLog = UpdateLogItem[];

export type DataNoticeEdge = {
  __typename?: "NoticeEdge" | undefined;
  node: {
    __typename?: "Notice" | undefined;
    index: number;
    payload: string;
    input: {
      __typename?: "Input" | undefined;
      index: number;
    };
  };
};
export type CanvasDimensions = { width: number; height: number };
export type DrawingMeta = {
  success: boolean;
  ipfsHash: string;
  canvasDimensions: CanvasDimensions;
};
export type RollupsContracts = {
  dappContract: Application;
  signer: JsonRpcSigner;
  inputContract: InputBox;
  erc721PortalContract: ERC721Portal;
  etherPortalContract: EtherPortal;
};

export type RollupsInteractions = {
  contracts?: RollupsContracts;
  sendInput: (strInput: string, tempDrawingData?: any) => Promise<void>;
  sendMintingInput: (input: any, tempDrawingData?: any) => Promise<void>;
  sendWithdrawInput: (amount: string) => Promise<void>;
  executeVoucher: (voucher: VoucherExtended) => Promise<boolean>;
};

export type Hex = `0x${string}`;
export type Hash = `0x${string}`;
export interface Validity {
  inputIndexWithinEpoch: number;
  outputIndexWithinInput: number;
  outputHashesRootHash: Hash;
  vouchersEpochRootHash: Hash;
  noticesEpochRootHash: Hash;
  machineStateHash: Hash;
  outputHashInOutputHashesSiblings: Hash[];
  outputHashesInEpochSiblings: Hash[];
}
export interface Proof {
  context: Hex;
  validity: Validity;
}

export type Address = `0x${string}`;

export interface ContestInitType {
  title: string;
  description: string;
  active_from: Moment | string | null;
  active_to: Moment | string | null;
  minting_active: number;
  [key: string]:
    | Moment
    | string
    | number
    | null
    | DrawingInputExtended[]
    | undefined;
}
export interface ContestType extends ContestInitType {
  id: string;
  minting_price: number;
  created_by: Address;
  drawings?: null | DrawingInputExtended[];
}
