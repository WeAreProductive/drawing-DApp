import CanvasToMint from "./CanvasToMint";
import CanvasToSave from "./CanvasToSave";
import CanvasDownload from "./CanvasDownload";
import { useCanvasControls } from "../../hooks/useCanvasControl";

type CanvasControlsProp = {
  enabled: boolean;
  canDownload: boolean;
};
const CanvasControls = ({ enabled, canDownload }: CanvasControlsProp) => {
  const { isActiveControl, drawingIsClosed } = useCanvasControls();
  return (
    <div className="flex gap-1">
      {isActiveControl && !drawingIsClosed && (
        <>
          <CanvasToSave enabled={enabled} />
        </>
      )}
      {drawingIsClosed && <CanvasToMint enabled={enabled} />}
      <CanvasDownload canDownload={canDownload} />
    </div>
  );
};

export default CanvasControls;
