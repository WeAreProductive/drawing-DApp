//refer to: https://www.mongodb.com/languages/mern-stack-tutorial
import express from "express";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import { API_ENDPOINTS } from "../config.mjs";
import { Conn } from "../db/conn.mjs";

// imagesdRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const imagesRoutes = express.Router();
const { getImages } = Conn();

// This will help us connect to the database
// This section will help you get a list of all the records.
imagesRoutes.route(`${API_ENDPOINTS.imagesList}`).get(async (req, response) => {
  const images = await getImages();
  console.log(images);
  response.json(images);
});

export default imagesRoutes;
