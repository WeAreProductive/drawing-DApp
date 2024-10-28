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
            <div className="rounded-xl bg-card p-6">
              <ImagesListRollups />
            </div>
          </CanvasContextProvider>
        </GraphQLProvider>
      </Page>
    </>
  );
};

export default Browse;
