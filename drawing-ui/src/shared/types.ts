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
  dappState: string; // @TODO enum one of the predefined values
  setDappState: React.Dispatch<string>;
  currentDrawingData: null | DrawingInput;
  setCurrentDrawingData: React.Dispatch<null | DrawingInput>;
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
// @TODO change after drawing input is managed in the BE
export type DrawingInput = {
  id: string; // creator's account - timestamp
  dateCreated: string; // date-time string
  lastUpdated: null | string; // last update date-time string
  owner: string; //last painter's account
  updateLog: { dateUpdated: string; painter: string; action: string }[];
  drawing: string; // svg's json string
  voucherRequested: boolean;
};