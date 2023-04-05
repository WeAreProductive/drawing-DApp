//refer to: https://www.mongodb.com/languages/mern-stack-tutorial
import express from "express";

import { API_ENDPOINTS } from "../config.mjs";
import { dbConnect } from "../db/index.js";

// imagesdRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const imagesRoutes = express.Router();
const { getImages } = dbConnect();

/**
 * Access all the svgs route
 */
imagesRoutes.route(`${API_ENDPOINTS.imagesList}`).get(async (req, response) => {
  const images = await getImages();
  //return response
  response.json(images);
});

export default imagesRoutes;
