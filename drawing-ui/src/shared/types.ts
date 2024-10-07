import { Canvas } from "fabric/fabric-impl";
import { JsonRpcSigner } from "@ethersproject/providers";
import {
  InputBox,
  DAppAddressRelay,
  CartesiDApp,
  ERC721Portal,
} from "@cartesi/rollups";
import { Dispatch, SetStateAction } from "react";

export type Network = {
  token: string;
  label: string;
  rpcUrl: string;
  graphqlAPIURL: string;
  inspectAPIURL: string;
  DAppRelayAddress: string;
  InputBoxAddress: string;
  Erc721PortalAddress: string;
  ercToMint: string;
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
  currentDrawingData: null | DrawingInputExtended;
  setCurrentDrawingData: React.Dispatch<null | DrawingInputExtended>;
  clearCanvas: () => void;
  currentDrawingLayer: null | DrawingObject[];
  setCurrentDrawingLayer: React.Dispatch<DrawingObject[]>;
  redoObjectsArr: DrawingObject[];
  setRedoObjectsArr: React.Dispatch<DrawingObject[]>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export type VoucherExtended = {
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
};
// sent Drawings data
export interface DrawingInput {
  drawing: string;
  dimensions: CanvasDimensions;
  log: string[];
}
// received Drawings data
export interface DrawingInputExtended extends Omit<DrawingInput, "dimensions"> {
  uuid: string;
  owner: string; //last painter's account
  update_log: string[];
  voucher_requested?: boolean;
  date_created?: string; // date-time string
  dimensions: string;
  private: 0 | 1;
}
export type DrawingObject = { [key: string]: any };
export type UpdateLogItem = {
  date_updated: string;
  painter: string;
  action: string;
  drawing_objects: DrawingObject[];
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
  dappContract: CartesiDApp;
  signer: JsonRpcSigner;
  relayContract: DAppAddressRelay;
  inputContract: InputBox;
  erc721PortalContract: ERC721Portal;
};

export type RollupsInteractions = {
  contracts?: RollupsContracts;
  sendInput: (strInput: string) => Promise<void>;
  executeVoucher: (
    voucher: VoucherExtended,
  ) => Promise<VoucherExtended | undefined>;
};
