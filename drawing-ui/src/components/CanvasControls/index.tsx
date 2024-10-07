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
  const { isActiveControl } = useCanvasControls();
  return (
    <div className="flex gap-2">
      {isActiveControl && (
        <>
          <CanvasUndo canUndo={canUndo} />
          <CanvasRedo canRedo={canRedo} />
        </>
      )}

      <CanvasReset />
      <CanvasToSave enabled={enabled} />
      <CanvasToMint enabled={enabled} />
      <CanvasDownload canDownload={canDownload} />
    </div>
  );
};

export default CanvasControls;
