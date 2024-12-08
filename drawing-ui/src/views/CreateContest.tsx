import ContestCreateInput from "../components/Contests/ContestCreateInput";
import Page from "../layouts/Page";

const CreateContest = () => {
  return (
    <Page>
      <div className="grid gap-4">
        <h1>Create New Contest</h1>
        <div className="flex rounded-xl p-6">
          <ContestCreateInput />
        </div>
      </div>
    </Page>
  );
};
export default CreateContest;
