import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { useCanvasContext } from "../../context/CanvasContext";
type CanvasDownloadProp = {
  canDownload: boolean;
};
const CanvasDownload = ({ canDownload }: CanvasDownloadProp) => {
  const { canvas } = useCanvasContext();
  const handleCanvasDownload = (type: string) => {};
  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => handleCanvasDownload("svg")}
        disabled={!canDownload}
        title="Redo"
      >
        <Download size={18} strokeWidth={1.5} />
        SVG
      </Button>
      <Button
        variant={"outline"}
        onClick={() => handleCanvasDownload("png")}
        disabled={!canDownload}
        title="Redo"
      >
        <Download size={18} strokeWidth={1.5} />
        PNG
      </Button>
    </>
  );
};

export default CanvasDownload;
