import { useEffect, useState } from "react";
import { useWallets } from "@web3-onboard/react";
import { useCanvasContext } from "../context/CanvasContext";
import { nowUnixTimestamp } from "../utils";

export const useCanvasControls = () => {
  const { currentDrawingData } = useCanvasContext();
  console.log(currentDrawingData);
  const [isActiveControl, setIsActiveControl] = useState(true);
  const [drawingIsClosed, setDrawingIsClosed] = useState(false);
  const [mintingIsClosed, setMintingIsClosed] = useState(false);
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const getIsClosedDrawing = (closedAtTimestamp: string | undefined) => {
    if (!closedAtTimestamp) return;
    const unixTimestampNow = nowUnixTimestamp();
    return Number(closedAtTimestamp) <= unixTimestampNow;
  };
  const getIsWinner = (uuid: string | undefined) => {
    if (!currentDrawingData?.contest || !uuid) return;
    return currentDrawingData?.contest.winner == uuid;
  };
  useEffect(() => {
    if (!currentDrawingData) return;
    if (currentDrawingData.is_private == 0) {
      // we don't care about the owner if drawing is public
      setIsActiveControl(true);
    } else {
      // only the owner can update the drawing
      currentDrawingData.owner === account
        ? setIsActiveControl(true)
        : setIsActiveControl(false);
    }
  }, [currentDrawingData?.owner]);

  useEffect(() => {
    const now = nowUnixTimestamp();
    let shouldCloseDrawing = false;
    if (currentDrawingData?.closed_at <= now) {
      shouldCloseDrawing = true;
    }
    setDrawingIsClosed(shouldCloseDrawing);
  }, [currentDrawingData?.closed_at]);
  useEffect(() => {
    const now = nowUnixTimestamp();
    let shouldCloseMinting = false;
    if (currentDrawingData?.contest) {
      const { contest } = currentDrawingData;
      if (contest.minting_closed_at <= now) shouldCloseMinting = true;
    }
    setMintingIsClosed(shouldCloseMinting);
  }, [
    currentDrawingData?.contest,
    currentDrawingData?.contest?.minting_closed_at,
  ]);

  return {
    isActiveControl,
    drawingIsClosed,
    mintingIsClosed,
    getIsClosedDrawing,
    getIsWinner,
  };
};
