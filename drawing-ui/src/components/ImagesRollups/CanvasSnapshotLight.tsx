type CanvasSnapshotLightProp = {
  src: string;
};

const CanvasSnapshotLight = ({ src }: CanvasSnapshotLightProp) => {
  const svg = new Blob([src], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);
  return <img src={url} alt="drawing preview" />;
};

export default CanvasSnapshotLight;
