import { useEffect, useRef, useState } from "react";
import { DrawingInputExtended } from "../../shared/types";
import CanvasSnapshot from "./CanvasSnapshot";
import { useWallets } from "@web3-onboard/react";
import { useInspect } from "../../hooks/useInspect";
import { useCanvasContext } from "../../context/CanvasContext";
import { DAPP_STATE } from "../../shared/constants";
type DrawingsListProp = {
  drawingsType: string;
};
const DrawingsList = ({ drawingsType }: DrawingsListProp) => {
  const [connectedWallet] = useWallets();
  const { dappState } = useCanvasContext();
  const { inspectCall } = useInspect();

  const account = connectedWallet.accounts[0].address;
  const [drawings, setDrawings] = useState<DrawingInputExtended[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);
  const initDrawingsData = async () => {
    if (
      dappState == DAPP_STATE.canvasInit ||
      dappState == DAPP_STATE.refetchDrawings
    ) {
      let queryString = "";
      if (drawingsType == "all") {
        queryString = "drawings";
      } else if (drawingsType == "user") {
        queryString = `drawings/owner/${account}`;
      }
      const data = await inspectCall(queryString);
      setDrawings(data);
    }
  };
  const fetchData = async () => {
    console.log("Fetching more drawings");
    setIsLoading(true);
    setError(null);
    let queryString = "";
    if (drawingsType == "all") {
      queryString = "drawings";
    } else if (drawingsType == "user") {
      queryString = `drawings/owner/${account}`;
    }
    const data = await inspectCall(queryString);
    setDrawings((prevItems) => [...prevItems, ...data]);
    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
  };
  // const fetchData = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const response = await fetch(
  //       `https://api.example.com/items?page=${page}`,
  //     );
  //     const data = await response.json();

  //     setItems((prevItems) => [...prevItems, ...data]);
  //     setPage((prevPage) => prevPage + 1);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  useEffect(() => {
    initDrawingsData();
  }, [dappState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
        }
      },
      { threshold: 1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <div className="-mx-1 flex flex-wrap">
      {drawings && drawings.length > 0 ? (
        drawings.map((drawing) => {
          try {
            return (
              <div key={`${drawing.uuid}`} className="w-1/2 p-2">
                <CanvasSnapshot src={drawing} />
              </div>
            );
          } catch (e) {
            console.log(e);
          }
        })
      ) : (
        <div className="p-2">Canvas shanpshots will appear here...</div>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <div ref={observerTarget}></div>
    </div>
  );
};

export default DrawingsList;
