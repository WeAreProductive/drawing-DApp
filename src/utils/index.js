export const parseCanvasData = (data) => {
  const canvasObjData = JSON.parse(data);
  return JSON.stringify({ objects: canvasObjData.objects });
};
