import { BASE_URL } from "../shared/constants";
export const canvasStore = async (canvasData) => {
  try {
    const response = await fetch(`${BASE_URL}/canvas/store`, {
      method: "POST",
      body: canvasData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};

export const canvasLoad = async (canvasSource) => {
  try {
    const queryParams = new URLSearchParams({
      source: canvasSource,
    });
    const response = await fetch(`${BASE_URL}/canvas/load?${queryParams}`);
    return response.json();
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};

export const getCanvasImages = async () => {
  try {
    const response = await fetch(`${BASE_URL}/images/list`);
    const data = await response.json();
    return data.list;
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};