/**
 * Converts Drawing to json string
 * sends last drawing layer's data
 * to emit a NOTICE with
 * the current drawing data
 */
import { useSetChain } from "@web3-onboard/react";
import { useCanvasContext } from "../../context/CanvasContext";
import configFile from "../../config/config.json";
import { DrawingObject, Network } from "../../shared/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useWallets } from "@web3-onboard/react";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { validateInputSize, prepareDrawingObjectsArrays } from "../../utils";
import { useDrawing } from "../../hooks/useDrawing";
import { useRollups } from "../../hooks/useRollups";
import { DAPP_STATE } from "../../shared/constants";

const config: { [name: string]: Network } = configFile;

type CanvasToSaveProp = {
  enabled: boolean;
};
const CanvasToSave = ({ enabled }: CanvasToSaveProp) => {
  const {
    canvas,
    currentDrawingData,
    currentDrawingLayer,
    setLoading,
    dappState,
    setDappState,
    setTempDrawingData,
  } = useCanvasContext();
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { sendInput } = useRollups(config[connectedChain.id].DAppRelayAddress);
  const { getNoticeInput } = useDrawing();
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const currentUuid = uuidv4();

  const saveDrawing = async (
    canvasData: { content: DrawingObject[] },
    privateDrawing: 0 | 1,
  ) => {
    const uuid = currentDrawingData ? currentDrawingData.uuid : currentUuid;
    const owner = currentDrawingData ? currentDrawingData.owner : account;
    const canvasDimensions = {
      width: canvas?.width || 0,
      height: canvas?.height || 0,
    };

    const strInput = getNoticeInput(
      canvasData,
      uuid,
      owner,
      privateDrawing,
      canvasDimensions,
    );

    if (!currentDrawingData) {
      console.log("setting the temp drawing data");
      const strDimensions = JSON.stringify(canvasDimensions);
      const initCanvasData = {
        uuid: uuid,
        owner: account,
        update_log: [[JSON.stringify(currentDrawingLayer), account]],
        dimensions: strDimensions,
        private: privateDrawing,
      };
      await sendInput(strInput, initCanvasData);
    } else {
      await sendInput(strInput);
    }
  };

  const handlePrivateDrawing = (canvasData: { content: DrawingObject[] }) => {
    confirmAlert({
      title: "Set the drawing as PRIVATE?",
      message: "",
      buttons: [
        {
          label: "OK",
          onClick: async () => {
            await saveDrawing(canvasData, 1);
          },
        },
        {
          label: "NO",
          onClick: async () => {
            await saveDrawing(canvasData, 0);
          },
        },
      ],
    });
  };

  const handleCanvasToSave = async () => {
    if (!canvas) return;
    if (!canvas.isDrawingMode) {
      canvas.isDrawingMode = true;
    }
    if (!currentDrawingLayer) return;
    if (currentDrawingLayer.length < 1) return;

    setLoading(true);
    setDappState(DAPP_STATE.canvasSave);
    const canvasContent = canvas.toJSON(); // or canvas.toObject()
    // !!!! extracts the !!! currents session !!!! drawing objects using the old and current drawing data
    const currentDrawingLayerObjects = prepareDrawingObjectsArrays(
      currentDrawingData,
      canvasContent.objects,
    );
    let canvasData = {
      content: currentDrawingLayerObjects,
    };
    // validate before sending the tx
    const result = validateInputSize(JSON.stringify(canvasData));
    if (!result.isValid) {
      toast.error(result.info.message, {
        description: result.info.description,
      });
      setLoading(false);
      return;
    }

    if (!currentDrawingData) {
      handlePrivateDrawing(canvasData);
    } else {
      saveDrawing(canvasData, currentDrawingData.private);
    }
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleCanvasToSave}
      disabled={!connectedChain || !enabled}
    >
      <Save size={18} className="mr-2" strokeWidth={1.5} />
      {dappState == DAPP_STATE.canvasSave ? "Saving..." : "Save"}
    </Button>
  );
};

export default CanvasToSave;
