import ContestsList from "../components/Contests/ContestsList";
import Page from "../layouts/Page";

const Contests = () => {
  return (
    <Page>
      <div className="grid gap-4">
        <h1>Contests list component</h1>
        <div className="p-6 rounded-xl bg-card">
          <ContestsList type={"active"} />
          <ContestsList type={"inactive"} />
        </div>
      </div>
    </Page>
  );
};
export default Contests;
