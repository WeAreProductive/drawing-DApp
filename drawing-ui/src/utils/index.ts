import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { encode as base64_encode } from "base-64";
import pako from "pako";
import { ethers } from "ethers";
import { CANVAS_DATA_LIMIT, LIMIT_WARNING_AT } from "../shared/constants";

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
  console.log(
    `Validating the compressed canvas data: ${inputBytesCompressed.length} (size)`,
  );
  // validate canvas data after compression
  // check that the expected rollups input
  // won't exceed the calculated limit for an optimal notice/voucher input
  const sizeLimit = isActiveDrawing
    ? CANVAS_DATA_LIMIT * LIMIT_WARNING_AT
    : CANVAS_DATA_LIMIT;
  if (inputBytesCompressed.length >= sizeLimit) {
    return false;
  }
  return true;
};
