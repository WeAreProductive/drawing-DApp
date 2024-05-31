import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { useCanvasContext } from "../../context/CanvasContext";
import { CANVAS_DOWNLOAD_FILETYPES } from "../../shared/constants";

type CanvasDownloadProp = {
  canDownload: boolean;
};
const CanvasDownload = ({ canDownload }: CanvasDownloadProp) => {
  const { canvas } = useCanvasContext();

  const handleCanvasDownload = (fileType: string) => {
    const element = document.createElement("a");
    let url: string;
    switch (fileType) {
      case CANVAS_DOWNLOAD_FILETYPES.svg:
        const generatedSVG = canvas?.toSVG();
        if (!generatedSVG) return;
        const svg = new Blob([generatedSVG], {
          type: "image/svg+xml",
        });
        url = URL.createObjectURL(svg);
        element.href = url;
        break;
      case CANVAS_DOWNLOAD_FILETYPES.png:
        const png = canvas?.toDataURL();
        if (!png) return;
        element.href = png;
        break;
    }

    element.download = `image.${fileType}`;
    element.click();
  };
  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => handleCanvasDownload(CANVAS_DOWNLOAD_FILETYPES.svg)}
        disabled={!canDownload}
        title="Redo"
      >
        <Download size={18} strokeWidth={1.5} />
        {CANVAS_DOWNLOAD_FILETYPES.svg.toLocaleUpperCase()}
      </Button>
      <Button
        variant={"outline"}
        onClick={() => handleCanvasDownload(CANVAS_DOWNLOAD_FILETYPES.png)}
        disabled={!canDownload}
        title="Redo"
      >
        <Download size={18} strokeWidth={1.5} />
        {CANVAS_DOWNLOAD_FILETYPES.png.toUpperCase()}
      </Button>
    </>
  );
};

export default CanvasDownload;
