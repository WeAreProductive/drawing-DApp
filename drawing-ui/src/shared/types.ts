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
  drawing?: string;
  events?: any;
};

export interface DrawingInput {
  drawing: string; // svg's json string
  dimensions: { width: number; height: number };
}
export type DrawingObject = { [key: string]: any };
export type UpdateLogItem = {
  date_updated: string;
  painter: string;
  action: string;
  drawing_objects: DrawingObject[];
};
export type UpdateLog = UpdateLogItem[];
export interface DrawingInputExtended extends DrawingInput {
  id: string; // creator's account - timestamp
  uuid: string;
  date_created: string; // date-time string
  last_updated: null | string; // last update date-time string
  owner: string; //last painter's account
  update_log: UpdateLog;
  voucher_requested: boolean;
}

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
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  sendInput: (strInput: string) => void;
};
