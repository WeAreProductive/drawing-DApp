import Page from "../layouts/Page";
import { CanvasContextProvider } from "../context/CanvasContext";
import DrawingControls from "../components/Drawing/DrawingControls";
import FabricJSCanvas from "../components/FabricJSCanvas";
import CanvasControls from "../components/CanvasControls";
import ImagesListRollups from "../components/ImagesRollups";
import { GraphQLProvider } from "../context/GraphQLContext";
import CanvasObjectsControl from "../components/CanvasObjectsControl.tsx";

const Draw = () => {
  return (
    <>
      <Page>
        <GraphQLProvider>
          <CanvasContextProvider>
            <div className="grid gap-4">
              <div className="grid gap-4 xl:grid-cols-[1fr,var(--sidebar-width)]">
                <div className="mx-auto">
                  <div className="sticky top-4 inline-flex flex-col gap-4">
                    <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                      <DrawingControls />
                      <CanvasControls />
                      <br></br>
                      <CanvasObjectsControl />
                    </div>
                    <FabricJSCanvas />
                  </div>
                </div>
                <div className="rounded-xl bg-card p-6">
                  <ImagesListRollups />
                </div>
              </div>
            </div>
          </CanvasContextProvider>
        </GraphQLProvider>
      </Page>
    </>
  );
};

export default Draw;
