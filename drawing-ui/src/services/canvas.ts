import { BASE_API_URL, API_ENDPOINTS } from "../shared/constants";

/**
 * Store the new canvas data
 * received and confirmed from the BE
 * as .png(?) files
 * one or more canvas data
 * @TODO on success display the neq canvas file in the left column
 */
//canvasObject shape is controlled by Fabric.js
export const storeAsFiles = async (canvasObject: any) => {
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
