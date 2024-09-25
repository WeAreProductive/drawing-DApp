import { useEffect, useRef, useState } from "react";
import { DrawingInputExtended } from "../../shared/types";
import CanvasSnapshot from "./CanvasSnapshot";
import { useWallets } from "@web3-onboard/react";
import { useParams } from "react-router-dom";
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
  const [drawings, setDrawings] = useState<DrawingInputExtended[] | null>(null);

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

  useEffect(() => {
    initDrawingsData();
  }, [dappState]);

  const listRefAllDrawings = useRef<HTMLInputElement>(null);
  useEffect(() => {
    listRefAllDrawings.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [drawings]);
  return (
    <div ref={listRefAllDrawings} className="-mx-1 flex flex-wrap">
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
    </div>
  );
};

export default DrawingsList;
