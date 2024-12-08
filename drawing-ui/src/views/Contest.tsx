import { useParams } from "react-router-dom";
import ContestBlock from "../components/Contests/ContestBlock";
import CreateDrawingToContest from "../components/Contests/CreateDrawingToContest";
import Page from "../layouts/Page";

const Contest = () => {
  const { contestId } = useParams();
  if (!contestId) return;
  return (
    <Page>
      <div className="grid gap-4">
        <h1> Single contest view contest id : {contestId}</h1>
        <div className="flex rounded-xl p-6">
          <ContestBlock contestId={contestId} />
        </div>
      </div>
    </Page>
  );
};

export default Contest;
