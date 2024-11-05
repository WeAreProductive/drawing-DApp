import Contests from "../components/Contests";
import Page from "../layouts/Page";

const BrowseContests = () => {
  return (
    <Page>
      <div className="grid gap-4">
        <h1>Contests list component</h1>
        <div className="p-6 rounded-xl bg-card">
          <Contests />
        </div>
      </div>
    </Page>
  );
};
export default BrowseContests;
