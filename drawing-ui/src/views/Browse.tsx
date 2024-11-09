import Page from "../layouts/Page";
import ImagesListRollups from "../components/ImagesRollups";

const Browse = () => {
  return (
    <>
      <Page>
        <div className="mb-6 rounded-xl bg-card p-6">
          <ImagesListRollups />
        </div>
      </Page>
    </>
  );
};

export default Browse;
