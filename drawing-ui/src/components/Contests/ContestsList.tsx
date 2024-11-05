import { useEffect, useRef, useState } from "react";
import { useInspect } from "../../hooks/useInspect";
import { useCanvasContext } from "../../context/CanvasContext";
import { nowUnixTimestamp } from "../../utils";

// @TODO define contest type
// @TODO define/update dappStates
// @TODO contests create validation
// @TODO after save info messages
const ContestsList = ({ contestType }: { contestType: string }) => {
  const { dappState } = useCanvasContext();
  const { inspectCall } = useInspect();
  const [contests, setContests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [page, setPage] = useState(1);
  const [lastElement, setLastElement] = useState(null);
  const [fetch, setFetch] = useState(false);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        console.warn("Scroll :: is intersecting ...");
        setFetch(true);
      }
    }),
  );
  useEffect(() => {
    if (fetch) {
      fetchData();
    }
  }, [fetch, page]);
  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement, dappState]);

  const initContestsData = async () => {
    console.warn("Init contest data :: .. ");
    console.warn(`Dapp state :: ${dappState}`);
    setFetch(false);
    setIsLoading(true);
    const now = nowUnixTimestamp();
    let queryString = "";
    queryString = `contests/page/1/${contestType}/${now}`;
    const data = await inspectCall(queryString, "plain");
    console.log(data);
    // const { next_page, contests } = data;
    // setContests(contests);
    // setPage(next_page);
    setIsLoading(false);
  };
  // };
  const fetchData = async () => {
    console.warn("Entering fetch contests data :: ...");
    console.warn(dappState);
    console.warn(`Fetching more contests :: page: ${page}`);
    if (page == 0 || page == undefined) return;
    setIsLoading(true);
    setFetch(false);
    setError({ error: false, message: "" });
    const now = nowUnixTimestamp();
    let queryString = "";
    queryString = `contests/page/${page}/${contestType}/${now}`;
    const data = await inspectCall(queryString);
    // const { next_page, contests } = data;
    // if (contests) setContests((prevItems) => [...prevItems, ...contests]);
    // setPage(next_page);
    setIsLoading(false);
  };

  useEffect(() => {
    initContestsData();
  }, [dappState, contestType]);
  return (
    <div className="flex flex-wrap -mx-1">
      {contests && contests.length > 0 ? (
        contests.map((contests, i) => {
          try {
            return i === contests.length - 1 ? (
              <div
                key={i} // @TODO replace with real data
                className="w-1/2 p-2 last-element"
                ref={setLastElement}
              >
                contest
              </div>
            ) : (
              <div key={i} className="w-1/2 p-2">
                contest
              </div>
            );
          } catch (e) {
            console.error(e);
          }
        })
      ) : (
        <div className="p-2">Contest data will appear here...</div>
      )}
      {error?.error && <p>Error: {error.message}</p>}
    </div>
  );
};
export default ContestsList;
