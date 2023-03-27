import { BASE_URL } from "../shared/constants";
export const canvasStore = async (canvasData) => {
  try {
    const res = await fetch(`${BASE_URL}/canvas/store`, {
      method: "POST",
      body: canvasData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};

export const canvasGet = async (canvasId) => {};
