import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encode as base64_encode } from "base-64";
import pako from "pako";
import { ethers } from "ethers";
import {
  CANVAS_DATA_LIMIT,
  LIMIT_WARNING_AT,
  VALIDATE_INPUT_ERRORS,
} from "../shared/constants";
import prettyBytes from "pretty-bytes";

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
  svg: string,
  isActiveDrawing: boolean = false,
) => {
  const canvasData = {
    svg: base64_encode(svg),
  };
  const compressed = pako.deflate(JSON.stringify(canvasData));
  const inputBytesCompressed = ethers.utils.isBytesLike(compressed)
    ? compressed
    : ethers.utils.toUtf8Bytes(compressed);

  const sizes =
    "Canvas " +
    prettyBytes(inputBytesCompressed.length) +
    " of " +
    prettyBytes(CANVAS_DATA_LIMIT) +
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
    if (inputBytesCompressed.length >= CANVAS_DATA_LIMIT) {
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
      inputBytesCompressed.length >= CANVAS_DATA_LIMIT * LIMIT_WARNING_AT &&
      inputBytesCompressed.length < CANVAS_DATA_LIMIT
    ) {
      validationResult.isValid = true;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.warning.message,
        description: VALIDATE_INPUT_ERRORS.warning.description,
        size: sizes,
        type: "warning",
      };
    } else if (inputBytesCompressed.length >= CANVAS_DATA_LIMIT) {
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

// const canvasObj = canvas.toObject();
// console.log(objOne.objects);
// console.log(objTwo.objects);
// const serializedOne = objOne.objects.map((element) => {
//   return JSON.stringify(element);
// });
// const serializedTwo = objTwo.objects.map((element) => {
//   return JSON.stringify(element);
// });
// // console.log(serializedOne);
// // console.log(serializedTwo);
// const filteredArray = serializedTwo.filter(
//   (value) => !serializedOne.includes(value),
// );
// console.log({ filteredArray });

/**
 * Converts each object in Fabrics/Canvas
 * objects array
 * in order to compare and extract
 * the newly created objects
 *
 * @param arr of canvas/drawing objects
 * @returns arr of JSON Stringified objects
 */
export const serializeArrElements = (arr: []) => {
  const serialized = arr.map((element) => {
    return JSON.stringify(element);
  });
  return serialized;
};
/**
 * Extracts the JSON STRINGIFIED drawing objects
 * at current drawing session.
 *
 * @param arrObjFull drawing objects at drawing finish
 * @param arrObjInitial drawing objects at canvas load
 * @returns drawing objects at current drawing session
 */
export const latestDrawingObjects = (arrObjFull: [], arrObjInitial: []) => {
  const latest = arrObjFull.filter((value) => !arrObjInitial.includes(value));
  return latest;
};
/**
 * Restores the initial shape
 * of Fabrics canvas/drawing objects array
 *
 * @param arr of JSON STRINGIFIED drawing objects
 * @returns arr of JSON parsed drawing OBJECTS
 */
export const deserializeArrElements = (arr: []) => {
  const deserialized = arr.map((element) => {
    return JSON.parse(element);
  });
  return deserialized;
};
// @TODO fix typing
export const prepareDrawingObjectsArrays = (
  logData: any,
  currentDrawingObjects: [],
) => {
  const currentDrawingObj: any = []; // array of objects
  if (logData) {
    // extract object array
    if (logData.update_log) {
      // array of objects for each drawing session
      console.log(logData.update_log);
      logData.update_log.forEach((element: { drawing_objects: any }) => {
        console.log(element.drawing_objects);
        currentDrawingObj.push(element.drawing_objects);
      });
      console.log(currentDrawingObj);
      // get all drawing_objects arrays and merge to one
    }
  }

  // if log data array has length
  // merge to one array
  // extract the current drawing session arr of object by compairint with `currentDrawingObjects`
  // return the current drawing session arr of objects
  return currentDrawingObj;
};
