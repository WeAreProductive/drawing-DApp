import Page from "../layouts/Page";
import { CanvasContextProvider } from "../context/CanvasContext";
import DrawingControls from "../components/Drawing/DrawingControls";
import FabricJSCanvas from "../components/FabricJSCanvas";
import CanvasControls from "../components/CanvasControls";
import ImagesListRollups from "../components/ImagesRollups";
import { GraphQLProvider } from "../context/GraphQLContext";

const Draw = () => {
  return (
    <Page>
      <GraphQLProvider>
        <CanvasContextProvider>
          <ImagesListRollups />
          <div className="canvas-wrapper">
            <FabricJSCanvas />
            <div className="controls-container">
              <DrawingControls />
              <CanvasControls />
            </div>
          </div>
        </CanvasContextProvider>
      </GraphQLProvider>
    </Page>
  );
};

export default Draw;
