import CanvasReset from "./CanvasReset";
import CanvasToMint from "./CanvasToMint";
import CanvasToSave from "./CanvasToSave";
import CanvasUndo from "./CanvasUndo";
import CanvasRedo from "./CanvasRedo";
import CanvasDownload from "./CanvasDownload";
import { useCanvasContext } from "../../context/CanvasContext";
import { useCanvasControls } from "../../hooks/useCanvasControl";

type CanvasControlsProp = {
  enabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canDownload: boolean;
};
const CanvasControls = ({
  enabled,
  canUndo,
  canRedo,
  canDownload,
}: CanvasControlsProp) => {
  const { isActiveControl, drawingIsClosed } = useCanvasControls();
  return (
    <div className="flex gap-2">
      {isActiveControl && !drawingIsClosed && (
        <>
          <CanvasUndo canUndo={canUndo} />
          <CanvasRedo canRedo={canRedo} />
          <CanvasToSave enabled={enabled} />
        </>
      )}
      {drawingIsClosed && <CanvasToMint enabled={enabled} />}
      <CanvasReset />
      <CanvasDownload canDownload={canDownload} />
    </div>
  );
};

export default CanvasControls;
