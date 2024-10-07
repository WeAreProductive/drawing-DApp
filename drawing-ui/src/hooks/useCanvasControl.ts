import { useWallets } from "@web3-onboard/react";

import { useCanvasContext } from "../context/CanvasContext";
import { useEffect, useState } from "react";

export const useCanvasControls = () => {
  const { currentDrawingData } = useCanvasContext();

  const [isActiveControl, setIsActiveControl] = useState(true);
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
  return { isActiveControl };
};
