import { useEffect, useState } from "react";
import { useContestsContext } from "../../context/ContestContext";
import { useInspect } from "../../hooks/useInspect";
import { sliceAccountStr, timestampToDate } from "../../utils";
import { Link } from "react-router-dom";
import { ContestType } from "../../shared/types";

const ContestBlock = ({ contestId }: { contestId: string }) => {
  // const { contest, setContest } = useContestsContext();
  // Use local state for now
  const [contest, setContest] = useState<null | ContestType>(null);
  const { inspectCall } = useInspect();
  const [loading, setLoading] = useState(false);

  const fetchContest = async () => {
    console.warn("Fetch contest data :: .. ");
    setLoading(true);
    let queryString = "";
    queryString = `contests/${contestId}`;
    const data = await inspectCall(queryString, "plain");
    const { contests } = JSON.parse(data);
    if (contests && contests.length) setContest(contests[0]); // single contest result
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
          {/* we know the contest the drawing will be added to - it is in the state */}
          <Link to="/drawing" state={{ contest: contest }}>
            Add drawing to this contest
          </Link>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ContestBlock;