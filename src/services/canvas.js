import { BASE_API_URL, API_ENDPOINTS } from "../config/constants";
// export const canvasStore = async (canvasData) => {
//   // try {
//   //   const response = await fetch(
//   //     `${BASE_API_URL}/${API_ENDPOINTS.canvasStore}`,
//   //     {
//   //       method: "POST",
//   //       body: canvasData,
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     }
//   //   );
//   //   const data = await response.json();
//   //   return data;
//   // } catch (error) {
//   //   //@TODO handle the error properly
//   //   console.log(error);
//   //   return { error: "Something went wrong ..." };
//   // }
// };

export const canvasLoad = async (canvasSource) => {
  //   // try {
  //   //   const queryParams = new URLSearchParams({
  //   //     source: canvasSource,
  //   //   });
  //   //   const response = await fetch(
  //   //     `${BASE_API_URL}/${API_ENDPOINTS.canvasLoad}?${queryParams}`
  //   //   );
  //   //   return response.json();
  //   // } catch (error) {
  //   //   //@TODO handle the error properly
  //   //   console.log(error);
  //   //   return { error: "Something went wrong ..." };
  //   // }
};

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
