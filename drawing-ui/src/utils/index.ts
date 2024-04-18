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
  const validationResult = {
    isValid: true,
    info: {
      message: "",
      description: "",
    },
  };
  const canvasData = {
    svg: base64_encode(svg),
  };
  console.log(`Warning limit: ${CANVAS_DATA_LIMIT * LIMIT_WARNING_AT}`);
  console.log(`Limit: ${CANVAS_DATA_LIMIT}`);

  const compressed = pako.deflate(JSON.stringify(canvasData));
  const inputBytesCompressed = ethers.utils.isBytesLike(compressed)
    ? compressed
    : ethers.utils.toUtf8Bytes(compressed);
  console.log(
    `Validating the compressed canvas data: ${inputBytesCompressed.length}`,
  );

  if (!isActiveDrawing) {
    if (inputBytesCompressed.length >= CANVAS_DATA_LIMIT) {
      validationResult.isValid = false;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.error.message,
        description: VALIDATE_INPUT_ERRORS.error.description,
      };
    }
  } else {
    if (
      inputBytesCompressed.length >= CANVAS_DATA_LIMIT * LIMIT_WARNING_AT &&
      inputBytesCompressed.length < CANVAS_DATA_LIMIT
    ) {
      validationResult.isValid = false;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.warning.message,
        description: VALIDATE_INPUT_ERRORS.warning.description,
      };
    } else if (inputBytesCompressed.length >= CANVAS_DATA_LIMIT) {
      validationResult.isValid = false;
      validationResult.info = {
        message: VALIDATE_INPUT_ERRORS.error.message,
        description: VALIDATE_INPUT_ERRORS.error.description,
      };
    }
  }
  return validationResult;
};
