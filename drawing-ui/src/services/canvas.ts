import { BASE_API_URL, API_ENDPOINTS } from "../shared/constants";

/**
 *
 * Convert the new canvas data
 * to base64 encoded string
 */
//canvasObject shape is controlled by Fabric.js
export const storeAsFiles = async (canvasObject: Object[], uuid: string) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/${API_ENDPOINTS.canvasesStore}`,
      {
        method: "POST",
        body: JSON.stringify({ filename: uuid, image: canvasObject }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data.base64out;
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong ..." };
  }
};
