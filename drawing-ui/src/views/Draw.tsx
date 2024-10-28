import Page from "../layouts/Page";
import { CanvasContextProvider } from "../context/CanvasContext";
import FabricJSCanvas from "../components/FabricJSCanvas";
import Controls from "../components/Controls";
import { GraphQLProvider } from "../context/GraphQLContext";
import DrawingContributorsList from "../components/ImagesRollups/DrawingContributorsList";

const Draw = () => {
  return (
    <>
      <Page>
        <GraphQLProvider>
          <CanvasContextProvider>
            <div className="grid gap-4">
              <div className="grid gap-4 xl:grid-cols-[1fr,var(--sidebar-width)]">
                <div className="w-full">
                  <div className="sticky top-4 flex flex-col gap-4">
                    <Controls />
                    <FabricJSCanvas />
                  </div>
                </div>
                <DrawingContributorsList />
              </div>
            </div>
          </CanvasContextProvider>
        </GraphQLProvider>
      </Page>
    </>
  );
};

export default Draw;
