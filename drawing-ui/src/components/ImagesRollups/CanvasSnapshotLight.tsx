import pako from "pako";
import { decode as base64_decode } from "base-64";

type CanvasSnapshotLightProp = {
  data: string;
};

const CanvasSnapshotLight = ({ data }: CanvasSnapshotLightProp) => {
  const decompressed = JSON.parse(pako.inflate(data, { to: "string" }));
  const src = base64_decode(decompressed.svg);
  const svg = new Blob([src], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);
  return <img src={url} alt="drawing preview" />;
};

export default CanvasSnapshotLight;
