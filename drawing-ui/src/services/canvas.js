import { BASE_API_URL, API_ENDPOINTS } from "../config/constants";
import { parseNoticeData } from "../utils";

/**
 * Get all the canvases as svgs data objects
 * {id: '', name: '', content: ''}
 * @returns array of svgs data
 */
export const getCanvasImages = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/${API_ENDPOINTS.imagesList}`);
    return response.json();
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};
/**
 * Store the new canvas data
 * received and confirmed from the BE
 * as .png(?) files
 * one or more canvas data
 * @TODO on success display the neq canvas file in the left column
 */
export const storeAsFiles = async (canvasObject) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/${API_ENDPOINTS.canvasesStore}`,
      {
        method: "POST",
        body: JSON.stringify(canvasObject),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data.base64out;
  } catch (error) {
    //@TODO handle the error properly
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};