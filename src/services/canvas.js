import { BASE_API_URL, API_ENDPOINTS } from "../config/constants";

e;
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
