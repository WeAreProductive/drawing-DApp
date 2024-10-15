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
import { useState } from "react";
import InputDialog from "../Drawing/InputDialog";

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
  } = useCanvasContext();
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { sendInput } = useRollups(config[connectedChain.id].DAppRelayAddress);
  const { getNoticeInput } = useDrawing();
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const currentUuid = uuidv4();
  const [isOpen, setIsOpenModal] = useState(false);
  const [value, setValue] = useState<any>([]);
  const [inputValues, setInputValues] = useState<any>({
    title: "",
    description: "",
    mintingPrice: "",
    private: false,
  });
  const saveDrawing = async () => {
    setDappState(DAPP_STATE.canvasSave);
    if (!canvas) return;
    const canvasContent = canvas?.toJSON(); // or canvas.toObject()
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

    const uuid = currentDrawingData ? currentDrawingData.uuid : currentUuid;

    const strInput = getNoticeInput(uuid, canvasData, inputValues);

    if (!currentDrawingData) {
      const canvasDimensions = {
        width: canvas?.width || 0,
        height: canvas?.height || 0,
      };
      const initCanvasData = {
        uuid: uuid,
        owner: account,
        update_log: [
          {
            drawing_objects: JSON.stringify(currentDrawingLayer),
            painter: account,
            dimensions: JSON.stringify(canvasDimensions),
          },
        ],
        dimensions: JSON.stringify(canvasDimensions),
        userInputData: inputValues,
      };
      await sendInput(strInput, initCanvasData);
    } else {
      await sendInput(strInput);
    }
  };

  const handleCanvasToSave = async () => {
    setLoading(true);
    if (!canvas) return;
    if (!canvas.isDrawingMode) {
      canvas.isDrawingMode = true;
    }
    if (!currentDrawingLayer) return;
    if (currentDrawingLayer.length < 1) return;

    if (!currentDrawingData) {
      // handlePrivateDrawing(canvasData);
      setIsOpenModal(true);
    } else {
      saveDrawing();
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        onClick={handleCanvasToSave}
        disabled={!connectedChain || !enabled}
      >
        <Save size={18} className="mr-2" strokeWidth={1.5} />
        {dappState == DAPP_STATE.canvasSave ? "Saving..." : "Save"}
      </Button>
      <InputDialog
        isOpen={isOpen}
        value={value}
        setValue={setValue}
        inputValues={inputValues}
        setInputValues={setInputValues}
        action={() => saveDrawing()}
      />
      {/* <InputDialog isOpen={isOpen} /> */}
    </>
  );
};

export default CanvasToSave;
