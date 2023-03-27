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

export const canvasLoad = async (canvasId) => {
  try {
    const options = {}; //later include canvas data(Id) to load
    const response = await fetch(`${BASE_URL}/canvas/load`);
    return response.json(); // pars
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};