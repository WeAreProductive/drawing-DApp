import Page from "../layouts/Page";
import ImagesListRollups from "../components/ImagesRollups";
const Browse = () => {
  return (
    <Page>
      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[1fr,var(--sidebar-width)]">
          <div className="rounded-xl bg-card p-6">
            <ImagesListRollups />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Browse;
