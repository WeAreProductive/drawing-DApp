import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
// import { fabric } from "fabric"; // v5
import * as fabric from 'fabric/node';
import { API_ENDPOINTS, ORIGIN_BASE } from "./config.mjs";
import imageToBase64 from "image-to-base64";

const port = 3000;
const corsOptions = {
  origin: ORIGIN_BASE,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1mb" })); //@TODO - set here proper limit to allow canvas to be saved properly
app.use(express.static("public")); //make the images accessible by the drawing-ui

app.post(API_ENDPOINTS.canvasStore, async (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body) {
    const filename = "temp-canvas";
    const fullPath = `public/canvas-images/${filename}.png`;

    try {
      //     //# create .png and save it on disk
      const canvas = new fabric.Canvas(null, { width: 600, height: 600 }); //sync width & height with FE
      canvas.loadFromJSON(JSON.stringify({ objects: req.body }), function () {
        canvas.renderAll();
        fs.promises
          .mkdir(
            path.dirname(fullPath), //@TODO set temp name
            {
              recursive: true,
            }
          )
          .then((x) => {
            const out = fs.createWriteStream(fullPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on("finish", () => console.log("The PNG file was created."));
          })
          .catch((error) => {
            console.log(error);
          });
      });

      //     //@TODO - can return the newly created filename f.ex. also
    } catch (error) {
      //@TODO handle error, return error response
      console.log(error);
    }
    try {
      const base64out = await imageToBase64(fullPath);
      res.send(
        JSON.stringify({
          success: true, //@TODO return the base64 string
          base64out: base64out,
        })
      );
    } catch (e) {
      console.log(e);
      // @TODO return error response
    }
    // });
  } else {
    res.send(
      JSON.stringify({
        error: "No data to save...",
      })
    );
  }
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export const viteNodeApp = app;