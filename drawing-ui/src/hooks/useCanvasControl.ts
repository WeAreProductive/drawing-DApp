import { useWallets } from "@web3-onboard/react";

import { useCanvasContext } from "../context/CanvasContext";
import { useEffect, useState } from "react";

export const useCanvasControls = () => {
  const { currentDrawingData } = useCanvasContext();

  const [isActiveControl, setIsActiveControl] = useState(true);
  const [drawingIsClosed, setDrawingIsClosed] = useState(false);
  const [connectedWallet] = useWallets();

  const account = connectedWallet.accounts[0].address;
  useEffect(() => {
    if (!currentDrawingData) return;
    if (currentDrawingData.private == 0) {
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
    const unixTimestamp = Math.floor(Date.now() / 1000);
    console.log({ unixTimestamp });
    console.log(currentDrawingData?.closed_at);
    let shouldCloseDrawing = false;
    if (currentDrawingData?.closed_at <= unixTimestamp) {
      shouldCloseDrawing = true;
    }
    setDrawingIsClosed(shouldCloseDrawing);
  }, [currentDrawingData?.closed_at]);
  return { isActiveControl, drawingIsClosed };
};
