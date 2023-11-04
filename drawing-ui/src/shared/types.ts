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
  setCanvas: React.Dispatch<React.SetStateAction<Canvas | null>>;
  canvasOptions: CanvasOptions;
  setOptions: React.Dispatch<React.SetStateAction<CanvasOptions>>;
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