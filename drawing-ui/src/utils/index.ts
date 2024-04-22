import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encode as base64_encode } from "base-64";
import pako from "pako";
import { ethers } from "ethers";
import {
  CANVAS_CURSOR_TYPES,
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

export const getCursorSvg = (
  brushSize: number,
  fillColor: string,
  cursorType: string,
) => {
  let cursor = "";
  switch (cursorType) {
    case CANVAS_CURSOR_TYPES.circle:
      cursor = `
      <svg
        height="${brushSize}"
        fill="${fillColor}"
        viewBox="0 0 ${brushSize * 2} ${brushSize * 2}"
        width="${brushSize}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50%"
          cy="50%"
          r="${brushSize}" 
        />
      </svg>
    `;
      break;
    case CANVAS_CURSOR_TYPES.spray:
      cursor = `
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="${brushSize}"
          height="${brushSize}"
          fill="${fillColor}"
          id="dots">
          <path d="M1.8 7.4c-.2 0-.4-.1-.6-.2-.3-.1-.5-.4-.6-.7-.1-.3 0-.7.1-1 .4-.6 1.2-.8 1.8-.5.3.2.5.5.6.8s0 .7-.1 1c-.3.4-.7.6-1.2.6zM6.6 10.1c-.2 0-.4-.1-.6-.2-.7-.3-.9-1.1-.5-1.7.3-.6 1.2-.8 1.8-.5.5.4.7 1.2.4 1.8-.2.4-.7.6-1.1.6zM17.4 16.4c-.2 0-.4-.1-.6-.2-.3-.2-.5-.4-.6-.8s0-.7.1-1c.3-.6 1.2-.8 1.8-.5.3.2.5.4.6.8.1.3 0 .7-.1 1-.3.5-.7.7-1.2.7zM22.2 19.1c-.2 0-.4-.1-.6-.2-.3-.2-.5-.4-.6-.8-.1-.3 0-.7.1-1 .3-.6 1.2-.8 1.8-.5.6.4.8 1.1.5 1.8-.4.5-.8.7-1.2.7zM1.8 19.1c-.5 0-.9-.2-1.1-.6-.2-.3-.2-.6-.1-1 .1-.3.3-.6.6-.8.6-.3 1.4-.1 1.8.5.2.3.2.6.1 1-.1.3-.3.6-.6.8-.2.1-.4.1-.7.1zM6.6 16.4c-.5 0-.9-.2-1.1-.6-.4-.6-.1-1.4.5-1.8.6-.3 1.4-.1 1.8.5.4.6.1 1.4-.5 1.8-.3 0-.5.1-.7.1zM17.4 10.1c-.5 0-.9-.2-1.1-.6-.3-.6-.1-1.4.5-1.7.6-.3 1.4-.1 1.8.5.3.6.1 1.4-.5 1.8h-.7zM22.2 7.4c-.5 0-.9-.2-1.1-.6-.4-.6-.1-1.4.5-1.8.6-.3 1.4-.1 1.8.5.4.6.1 1.4-.5 1.8-.3 0-.5.1-.7.1zM6.1 23.4c-.2 0-.4-.1-.6-.2-.3-.2-.5-.4-.6-.8-.1-.3 0-.7.1-1 .3-.6 1.2-.8 1.8-.5.6.4.8 1.1.5 1.7-.3.6-.7.8-1.2.8zM8.9 18.7c-.2 0-.4-.1-.6-.2-.6-.4-.8-1.1-.5-1.8.3-.6 1.2-.8 1.8-.5.6.4.8 1.1.5 1.8-.3.5-.8.7-1.2.7zM15.1 7.9c-.2 0-.4-.1-.6-.2-.6-.4-.8-1.1-.5-1.8.3-.6 1.2-.8 1.8-.5.6.4.8 1.1.5 1.8-.3.4-.7.7-1.2.7zM17.9 3.1c-.2 0-.4-.1-.6-.2-.3-.2-.5-.5-.6-.8-.1-.3 0-.7.1-1 .3-.6 1.2-.8 1.7-.5.6.4.8 1.1.5 1.8-.2.5-.7.7-1.1.7zM17.9 23.4c-.5 0-.9-.2-1.1-.6-.2-.3-.2-.6-.1-1 .1-.3.3-.6.6-.8.6-.3 1.4-.1 1.7.5.2.3.2.6.1 1-.1.3-.3.6-.6.8-.2.1-.4.1-.6.1zM15.1 18.7c-.5 0-.9-.2-1.1-.6-.2-.3-.2-.6-.1-1 .1-.3.3-.6.6-.8.6-.3 1.4-.1 1.8.5.4.6.1 1.4-.5 1.8-.2 0-.4.1-.7.1zM8.9 7.9c-.5 0-.9-.3-1.1-.7-.2-.3-.2-.6-.1-1 .1-.3.3-.6.6-.8.5-.3 1.3-.1 1.7.5.2.3.2.7.1 1-.1.3-.3.6-.6.8-.2.1-.4.2-.6.2zM6.1 3.1c-.4 0-.9-.2-1.1-.6-.2-.3-.2-.6-.1-1 .1-.3.3-.6.6-.8.6-.3 1.4-.1 1.8.5.4.6.1 1.4-.5 1.8-.2.1-.4.1-.7.1z"></path></svg>
      `;
      break;
  }

  return cursor;
};
