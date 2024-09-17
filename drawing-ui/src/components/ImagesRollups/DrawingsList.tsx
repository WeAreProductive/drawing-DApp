import { useEffect, useRef, useState } from "react";
import { DrawingInputExtended } from "../../shared/types";
import CanvasSnapshot from "./CanvasSnapshot";
import { useWallets } from "@web3-onboard/react";
import { useInspect } from "../../hooks/useInspect";
type DrawingsListProp = {
  drawings: DrawingInputExtended[] | null;
};
const DrawingsList = ({ drawingsType }: string) => {
  const [connectedWallet] = useWallets();
  const { inspectCall } = useInspect();
  const account = connectedWallet.accounts[0].address;
  const [drawings, setDrawings] = useState<DrawingInputExtended[] | null>(null);
  // const [noticeDrawings, setNoticeDrawings] = useState<
  //   DrawingInputExtended[] | null
  // >(null);

  const initDrawingsData = async () => {
    let queryString = "";
    if (drawingsType == "all") {
      queryString = "drawings";
    } else if (drawingsType == "user") {
      queryString = `drawings/owner/${account}`;
    }
    const data = await inspectCall(queryString);
    setDrawings(data);
  };

  useEffect(() => {
    initDrawingsData();
  }, []);

  const listRefAllDrawings = useRef<HTMLInputElement>(null);
  useEffect(() => {
    listRefAllDrawings.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [drawings]);
  return (
    <div ref={listRefAllDrawings} className="flex flex-wrap -mx-1">
      {drawings && drawings.length > 0 ? (
        drawings.map((drawing, idx) => {
          try {
            return (
              <div key={`${drawing.id}-${idx}`} className="w-1/2 p-2">
                <CanvasSnapshot key={`${drawing.uuid}-${idx}`} src={drawing} />
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
