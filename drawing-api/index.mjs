import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fabric } from "fabric"; // v5
import { API_ENDPOINTS, ORIGIN_BASE } from "./config.mjs";

const port = 3000;
const corsOptions = {
  origin: ORIGIN_BASE,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1mb" })); //@TODO - set here proper limit to allow canvas to be saved properly
app.use(express.static("public")); //make the images accessible by the drawing-ui

app.post(API_ENDPOINTS.canvasStore, (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body) {
    console.log(req.body.length, "req body");
    req.body.map((data) => {
      try {
        const canvasItem = JSON.parse(data);
        //# create .png and save it on disk
        //@TODO perform some checks for not duplicating the image files
        const canvas = new fabric.Canvas(null, { width: 600, height: 600 }); //sync width & height with FE
        canvas.loadFromJSON(
          JSON.stringify({ objects: canvasItem.content.objects }),
          function () {
            canvas.renderAll();
            fs.promises
              .mkdir(
                path.dirname(`public/canvas-images/${canvasItem.name}.png`),
                {
                  recursive: true,
                }
              )
              .then((x) => {
                const out = fs.createWriteStream(
                  `public/canvas-images/${canvasItem.name}.png`
                );
                const stream = canvas.createPNGStream();
                stream.pipe(out);
                out.on("finish", () =>
                  console.log("The PNG file was created.")
                );
              })
              .catch((error) => {
                console.log(error);
              });
          }
        );
        //@TODO - can return the newly created filename f.ex. also
      } catch (error) {
        //@TODO handle error, return error response
        console.log(error);
      }
    });
    res.send(
      JSON.stringify({
        success: true,
      })
    );
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