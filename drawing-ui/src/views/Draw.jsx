import Page from "../layouts/Page";
import { CanvasContextProvider } from "../context/CanvasContext";
import DrawingControls from "../components/Drawing/DrawingControls";
import FabricJSCanvas from "../components/FabricJSCanvas";
import CanvasControls from "../components/CanvasControls";

const Draw = () => {
  return (
    <Page>
      <h2>Draw...</h2>
      <CanvasContextProvider>
        {/* <ImagesListRollups /> */}
        <div className="canvas-wrapper">
          <FabricJSCanvas />
          <div className="controls-container">
            <DrawingControls />
            <CanvasControls />
          </div>
        </div>
      </CanvasContextProvider>
    </Page>
  );
};

export default Draw;
