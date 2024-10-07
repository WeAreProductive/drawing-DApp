import { useWallets } from "@web3-onboard/react";

import { useCanvasContext } from "../context/CanvasContext";
import { useEffect, useState } from "react";

export const useCanvasControls = () => {
  const { currentDrawingData } = useCanvasContext();

  const [isActiveControl, setIsActiveControl] = useState(true);
  const [connectedWallet] = useWallets();

  const account = connectedWallet.accounts[0].address;
  // @TODO check isPrivate
  useEffect(() => {
    if (!currentDrawingData) return;
    currentDrawingData.owner === account
      ? setIsActiveControl(true)
      : setIsActiveControl(false);
  }, [currentDrawingData?.owner]);
  return { isActiveControl };
};
