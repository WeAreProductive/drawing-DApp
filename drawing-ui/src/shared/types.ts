import { Canvas } from "fabric/fabric-impl";

export type Network = {
  token: string;
  label: string;
  rpcUrl: string;
  graphqlAPIURL: string;
  inspectAPIURL: string;
  DAppRelayAddress: string;
  InputBoxAddress: string;
  Erc721PortalAddress: string;
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
  currentDrawingData: null | DrawingInput;
  setCurrentDrawingData: React.Dispatch<null | DrawingInput>;
  clearCanvas: () => void;
};
export type VoucherExtended = {
  id?: string;
  index: number;
  destination: string;
  input: any; //{index: number; epoch: {index: number; }
  payload: string;
  proof?: any;
  executed?: any;
  msg?: string;
};

export interface DrawingInput {
  drawing: string; // svg's json string
}
export interface DrawingInputExtended extends DrawingInput {
  id: string; // creator's account - timestamp
  date_created: string; // date-time string
  last_updated: null | string; // last update date-time string
  owner: string; //last painter's account
  update_log: { date_updated: string; painter: string; action: string }[];
  drawing: string; // svg's json string
  voucher_requested: boolean;
}
