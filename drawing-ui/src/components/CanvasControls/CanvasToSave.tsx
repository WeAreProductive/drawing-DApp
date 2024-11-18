/**
 * Converts Drawing to json string
 * sends last drawing layer's data
 * to emit a NOTICE with
 * the current drawing data
 */

import { toast } from "sonner";
import { Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useCanvasContext } from "../../context/CanvasContext";
import { ContestType, DrawingUserInput } from "../../shared/types";
import { Button } from "../ui/button";

import {
  validateInputSize,
  prepareDrawingObjectsArrays,
  hoursToTimestamp,
  getHoursLeft,
} from "../../utils";
import { useDrawing } from "../../hooks/useDrawing";
import { useRollups } from "../../hooks/useRollups";
import { DAPP_STATE } from "../../shared/constants";
import { useEffect, useState } from "react";
import InputDialog from "../Drawing/InputDialog";
import { useConnectionContext } from "../../context/ConnectionContext";

import { nowUnixTimestamp } from "../../utils";
import { useInspect } from "../../hooks/useInspect";
import { useLocation } from "react-router-dom";

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
  const { connectedChain, account } = useConnectionContext();
  const { sendInput } = useRollups();
  const { getNoticeInput } = useDrawing();
  const { inspectCall } = useInspect();
  const currentUuid = uuidv4();
  const [isOpen, setIsOpenModal] = useState(false);
  const [contests, setContests] = useState<[] | ContestType[]>([]);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const data = location.state;
  const initialInputValues = {
    title: { value: "", isReadOnly: false },
    description: { value: "", isReadOnly: false },
    minting_price: {
      value: data && data.contest ? data.contest.minting_price : 0,
      isReadOnly: data && data.contest ? true : false,
    },
    is_private: { value: false, isReadOnly: false },
    open: {
      value: data && data.contest ? getHoursLeft(data.contest.active_to) : "", // calculate contest active to timestamp - now timestamp and convert the difference in hours
      isReadOnly: data && data.contest ? true : false,
    },
    contest: {
      value: data && data.contest ? data.contest.id : 0,
      isReadOnly: false,
    },
  };
  const [inputValues, setInputValues] =
    useState<DrawingUserInput>(initialInputValues);
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
    const { title, description, minting_price, is_private, open, contest } =
      inputValues;
    const userInput = {
      title: title.value,
      description: description.value,
      minting_price: minting_price.value,
      is_private: is_private.value,
      open: open.value,
      contest: contest.value,
    };
    const strInput = getNoticeInput(uuid, canvasData, userInput);

    if (!currentDrawingData) {
      const canvasDimensions = {
        width: canvas?.width || 0,
        height: canvas?.height || 0,
      };
      const closedAt = moment().unix() + hoursToTimestamp(open.value); // converted in seconds
      const initCanvasData = {
        uuid: uuid,
        owner: account,
        closed_at: closedAt,
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
    setInputValues(initialInputValues);
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
      setIsOpenModal(true);
    } else {
      saveDrawing();
    }
  };
  const fetchContests = async () => {
    if (!isOpen) return;
    console.warn("Fetch contests data :: ...");
    const now = nowUnixTimestamp();
    let queryString = "";
    queryString = `contests/page/${page}/incompleted/${now}`;
    const data = await inspectCall(queryString, "plain");
    const { next_page, contests } = JSON.parse(data);
    // @TODO handle pagination when more contests are available?
    if (contests) setContests(contests);
  };
  useEffect(() => {
    fetchContests();
  }, [isOpen]);
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
        openHandler={setIsOpenModal}
        inputValues={inputValues}
        setInputValues={setInputValues}
        action={() => saveDrawing()}
        contests={contests}
      />
    </>
  );
};

export default CanvasToSave;
