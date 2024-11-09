import Page from "../layouts/Page";
import FabricJSCanvas from "../components/FabricJSCanvas";
import Controls from "../components/Controls";
import DrawingContributorsList from "../components/ImagesRollups/DrawingContributorsList";

const Draw = () => {
  return (
    <>
      <Page>
        <div className="grid gap-4">
          <div className="mb-16 grid gap-4 xl:grid-cols-[1fr,var(--sidebar-width)]">
            <div className="w-full">
              <div className="sticky top-4 flex flex-col gap-4">
                <Controls />
                <FabricJSCanvas />
              </div>
            </div>
            <DrawingContributorsList />
          </div>
        </div>
      </Page>
    </>
  );
};

export default Draw;
