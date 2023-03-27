export const parseCanvasData = (data) => {
  const canvasObjData = JSON.parse(data);
  return JSON.stringify({ objects: canvasObjData.objects });
};

export const srcToJson = (src) => {
  return src.replace(".png", ".json");
};