import { useEffect, useRef, useState } from "react";
import { DrawingInputExtended } from "../../shared/types";
import CanvasSnapshot from "./CanvasSnapshot";
import { useInspect } from "../../hooks/useInspect";
import { useCanvasContext } from "../../context/CanvasContext";
import { useConnectionContext } from "../../context/ConnectionContext";

type DrawingsListProp = {
  drawingsType: string;
};

const DrawingsList = ({ drawingsType }: DrawingsListProp) => {
  const { account } = useConnectionContext();
  const { dappState } = useCanvasContext();
  const { inspectCall } = useInspect();
  const [drawings, setDrawings] = useState<DrawingInputExtended[]>([]);
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

  const initDrawingsData = async () => {
    console.warn("Init drawing data ...");
    console.warn(`Dapp state ${dappState}`);
    setFetch(false);
    setIsLoading(true);

    let queryString = "";
    if (drawingsType == "all") {
      queryString = "drawings/page/1";
    } else if (drawingsType == "user") {
      queryString = `drawings/owner/${account}/page/1`;
    }
    const data = await inspectCall(queryString);
    const { next_page, drawings } = data;
    setDrawings(drawings);
    setPage(next_page);
    setIsLoading(false);
  };
  // };
  const fetchData = async () => {
    console.warn("entering fetch ...");
    console.warn(dappState);
    console.warn(`Fetching more drawings - page: ${page}`);
    if (page == 0 || page == undefined) return;
    setIsLoading(true);
    setFetch(false);
    setError({ error: false, message: "" });
    let queryString = "";
    if (drawingsType == "all") {
      queryString = `drawings/page/${page}`;
    } else if (drawingsType == "user") {
      queryString = `drawings/owner/${account}/page/${page}`;
    }
    const data = await inspectCall(queryString);
    const { next_page, drawings } = data;
    if (drawings) setDrawings((prevItems) => [...prevItems, ...drawings]);
    setPage(next_page);
    setIsLoading(false);
  };

  useEffect(() => {
    initDrawingsData();
  }, [dappState, account, drawingsType]);
  return (
    <div className="-mx-1 flex flex-wrap">
      {drawings && drawings.length > 0 ? (
        drawings.map((drawing, i) => {
          try {
            return i === drawings.length - 1 ? (
              <div
                key={`${drawing.uuid}`}
                className="last-element w-1/4 p-2"
                ref={setLastElement}
              >
                <CanvasSnapshot src={drawing} />
              </div>
            ) : (
              <div key={`${drawing.uuid}-${i}`} className="w-1/4 p-2">
                <CanvasSnapshot src={drawing} />
              </div>
            );
          } catch (e) {
            console.error(e);
          }
        })
      ) : (
        <div className="p-2">Canvas shanpshots will appear here...</div>
      )}
      {error?.error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default DrawingsList;
