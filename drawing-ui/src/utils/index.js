import { ethers } from "ethers";
export const parseCanvasData = (data) => {
  const canvasObjData = JSON.parse(data);
  return JSON.stringify({ objects: canvasObjData.objects });
};

export const srcToJson = (src) => {
  return src.replace(".png", ".json");
};

export const parseNoticeData = (noticeArray) => {
  //@TODO add img unique name
  const parsedArray = [];
  noticeArray.map((notice) => {
    const parsedPayload = ethers.utils.toUtf8String(notice.payload);
    parsedArray.push(parsedPayload);
  });
  return parsedArray;
};
