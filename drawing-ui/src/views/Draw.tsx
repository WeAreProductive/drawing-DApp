import Page from "../layouts/Page";
import { CanvasContextProvider } from "../context/CanvasContext";
import FabricJSCanvas from "../components/FabricJSCanvas";
import Controls from "../components/Controls";
import ImagesListRollups from "../components/ImagesRollups";
import { GraphQLProvider } from "../context/GraphQLContext";

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
                    <Controls />
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
