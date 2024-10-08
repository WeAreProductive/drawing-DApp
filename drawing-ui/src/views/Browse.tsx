import Page from "../layouts/Page";
import { CanvasContextProvider } from "../context/CanvasContext";
import ImagesListRollups from "../components/ImagesRollups";
import { GraphQLProvider } from "../context/GraphQLContext";

const Browse = () => {
  return (
    <>
      <Page>
        <GraphQLProvider>
          <CanvasContextProvider>
            <div className="grid gap-4">
              <div className="grid gap-4 xl:grid-cols-[1fr,var(--sidebar-width)]">
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

export default Browse;
