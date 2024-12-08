import ContestCreateInput from "../components/Contests/ContestCreateInput";
import CreateDrawingToContest from "../components/Contests/CreateDrawingToContest";
import Page from "../layouts/Page";

const CreateContest = () => {
  return (
    <Page>
      <div className="grid gap-4">
        <h1>Create New Contest</h1>
        <div className="flex rounded-xl p-6">
          <ContestCreateInput />
          <CreateDrawingToContest />
        </div>
      </div>
    </Page>
  );
};
export default CreateContest;
