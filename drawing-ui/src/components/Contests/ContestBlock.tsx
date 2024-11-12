import { useEffect, useState } from "react";
import { useContestsContext } from "../../context/ContestContext";
import { useInspect } from "../../hooks/useInspect";
import { sliceAccountStr, timestampToDate } from "../../utils";

const ContestBlock = ({ contestId }: { contestId: string }) => {
  const { contest, setContest } = useContestsContext();
  const { inspectCall } = useInspect();
  const [loading, setLoading] = useState(false);

  const fetchContest = async () => {
    console.warn("Fetch contest data :: .. ");
    setLoading(true);
    let queryString = "";
    queryString = `contests/${contestId}`;
    const data = await inspectCall(queryString, "plain");
    const { contests } = JSON.parse(data);
    if (contest.length) setContest(contests[0]); // single contest result
    setLoading(false);
  };
  useEffect(() => {
    if (!contestId) return;
    fetchContest();
  }, [contestId]);
  return (
    <div className="rounded-lg border bg-background p-2">
      {contest ? (
        <>
          <span className="block text-xs">{contest.title}</span>
          <span className="block text-xs">{contest.description}</span>
          <span className="block text-xs">
            created by: {sliceAccountStr(contest.created_by)}
          </span>
          <span className="block text-xs">
            active from: {timestampToDate(Number(contest.active_from))}
          </span>
          <span className="block text-xs">
            active to: {timestampToDate(Number(contest.active_to))}
          </span>
          <span className="block text-xs">
            minting is Open for: {contest.minting_active} hours
          </span>
          <span className="block text-xs">
            minting price: {contest.minting_price}{" "}
          </span>
          <span className="block text-xs">
            Number of drawings:{" "}
            {contest.drawings && contest.drawings.length > 0
              ? contest.drawings.length
              : 0}
          </span>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ContestBlock;
