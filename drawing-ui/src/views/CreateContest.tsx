import ContestInput from "../components/Contests/ContestInput";
import CreateDrawingToContest from "../components/Contests/CreateDrawingToContest";
import Page from "../layouts/Page";

const CreateContest = () => {
  return (
    <Page>
      <div className="grid gap-4">
        <h1>Create New Contest</h1>
        <div className="flex rounded-xl p-6">
          <ContestInput />
          <CreateDrawingToContest />
        </div>
      </div>
    </Page>
  );
};
export default CreateContest;
