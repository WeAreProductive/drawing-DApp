import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pako from "pako";
import { ethers } from "ethers";
import {
  DRAwING_INPUT_LIMIT,
  LIMIT_WARNING_AT,
  VALIDATE_INPUT_ERRORS,
} from "../shared/constants";
import prettyBytes from "pretty-bytes";
import {
  DrawingInputExtended,
  DrawingObject,
  UpdateLog,
  UpdateLogItem,
} from "../shared/types";

export const srcToJson = (src: string) => {
  return src.replace(".png", ".json");
};

export const sliceAccountStr = (str: string) => {
  if (!str) return;
  const len = str.length;
  const start = str.slice(0, 3);
  const end = str.slice(len - 5, len - 1);
  return `${start}...${end}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateInputSize = (
  currentDrawingData: DrawingInputExtended | null,
  strInput: string,
  isActiveDrawing: boolean = false,
) => {
  const drawingNoticePayload = {
    ...currentDrawingData,
    drawing: strInput, // FE updates the svg string
  };
  const compressed = pako.deflate(JSON.stringify(drawingNoticePayload));
  const inputBytesCompressed = ethers.utils.isBytesLike(compressed)
    ? compressed
    : ethers.utils.toUtf8Bytes(compressed);

  const sizes =
    "Canvas " +
    prettyBytes(inputBytesCompressed.length) +
    " of " +
    prettyBytes(DRAwING_INPUT_LIMIT) +
    " allowed.";

  const validationResult = {
    isValid: true,
    info: {
      message: "",
      description: "",
      size: sizes,
      type: "note",
    },
  };

  if (!isActiveDrawing) {
    if (inputBytesCompressed.length >= DRAwING_INPUT_LIMIT) {
      validationResult.isValid = false;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.error.message,
        description: VALIDATE_INPUT_ERRORS.error.description,
        size: sizes,
        type: "error",
      };
    }
  } else {
    if (
      inputBytesCompressed.length >= DRAwING_INPUT_LIMIT * LIMIT_WARNING_AT &&
      inputBytesCompressed.length < DRAwING_INPUT_LIMIT
    ) {
      validationResult.isValid = true;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.warning.message,
        description: VALIDATE_INPUT_ERRORS.warning.description,
        size: sizes,
        type: "warning",
      };
    } else if (inputBytesCompressed.length >= DRAwING_INPUT_LIMIT) {
      validationResult.isValid = false;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.error.message,
        description: VALIDATE_INPUT_ERRORS.error.description,
        size: sizes,
        type: "error",
      };
    }
  }
  return validationResult;
};

/**
 * Converts each object in Fabrics/Canvas
 * objects array
 * in order to compare and extract
 * the newly created objects
 *
 * @param arr of canvas/drawing objects
 * @returns arr of JSON Stringified objects
 */
export const serializeArrElements = (arr: DrawingObject[]) => {
  const serialized = arr.map((element) => {
    return JSON.stringify(element);
  });
  return serialized;
};
/**
 * Restores the initial shape
 * of Fabrics canvas/drawing objects array
 *
 * @param arr of JSON STRINGIFIED drawing objects
 * @returns arr of JSON parsed drawing OBJECTS
 */
export const deserializeArrElements = (arr: string[]) => {
  const deserialized = arr.map((element) => {
    return JSON.parse(element);
  });
  return deserialized;
};
/**
 * Extracts the current drawing session's
 * drawing objects by comparing after
 * JSON stringifying each element
 *
 * @param arrObjFull drawing objects at drawing finish
 * @param arrObjInitial drawing objects at canvas load
 * @returns drawing objects ARRAY at current drawing session
 */
export const latestDrawingObjects = (
  arrObjFull: DrawingObject[],
  arrObjInitial: DrawingObject[],
) => {
  // use arrays of serializes objects to compare them as strings for equality!
  const serializedFull = serializeArrElements(arrObjFull);
  const serializedInitial = serializeArrElements(arrObjInitial);
  const latest = serializedFull.filter(
    (value) => !serializedInitial.includes(value),
  );
  // restore object elements from json stringified elements
  const deserializedLatest = deserializeArrElements(latest);
  return deserializedLatest;
};
/**
 * Produces the drawing objects
 * array from the current drawing session
 *
 * @param rollupsDrawingData
 * @param currentDrawingObjects
 * @returns
 */
export const prepareDrawingObjectsArrays = (
  rollupsDrawingData: DrawingInputExtended | null,
  currentDrawingObjects: DrawingObject[],
) => {
  const storedDrawingObj: DrawingObject[] = []; // array of objects
  if (rollupsDrawingData) {
    const { update_log } = rollupsDrawingData;
    // extract object array
    if (update_log.length) {
      // array of objects for each drawing session
      update_log.forEach((element) => {
        storedDrawingObj.push(element.drawing_objects);
      });
      // get all drawing_objects arrays and merge to one
    }
    // flatten stored drawing array
    // extract the current drawing session arr of objects
    const currentDrawingObj = latestDrawingObjects(
      currentDrawingObjects,
      storedDrawingObj.flat(),
    );
    return currentDrawingObj;
  }
  return currentDrawingObjects;
};
export const snapShotJsonfromLog = (update_log: UpdateLog): string => {
  const drawingObjectsArr: DrawingObject[] = [];
  update_log.forEach((element: UpdateLogItem) => {
    drawingObjectsArr.push(element.drawing_objects);
  });
  const snapShot = drawingObjectsArr.flat();
  return JSON.stringify({ objects: snapShot });
};
