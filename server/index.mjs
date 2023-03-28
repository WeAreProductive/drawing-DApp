import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fabric } from "fabric"; // v5
import { API_ENDPOINTS, ORIGIN_BASE } from "./config.mjs";

const port = 8000;

const corsOptions = {
  origin: ORIGIN_BASE,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1mb" })); //@TODO - set here proper limit to allow canvas to be saved properly

app.post(API_ENDPOINTS.canvasStore, (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body) {
    try {
      //for now we'll save the canvas to .json file
      const content = JSON.stringify(req.body);
      const id = Date.now();

      //TODO  handle the errors properly

      //#1 save canvas state as json
      fs.promises
        .mkdir(path.dirname(`canvas-json/${id}-canvas.json`), {
          recursive: true,
        })
        .then((x) =>
          fs.promises.writeFile(`canvas-json/${id}-canvas.json`, content)
        )
        .catch((error) => {
          console.log(error);
        });

      //#2 create .png and save it on disk
      const canvas = new fabric.Canvas(null, { width: 600, height: 600 }); //sync width & height with FE
      canvas.loadFromJSON(
        JSON.stringify({ objects: req.body.objects }),
        function () {
          canvas.renderAll();
          fs.promises
            .mkdir(path.dirname(`public/canvas-images/${id}-canvas.png`), {
              recursive: true,
            })
            .then((x) => {
              const out = fs.createWriteStream(
                `public/canvas-images/${id}-canvas.png`
              );
              const stream = canvas.createPNGStream();
              stream.pipe(out);
              out.on("finish", () => console.log("The PNG file was created."));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
      res.send(
        JSON.stringify({
          success: true,
        })
      );
    } catch (error) {
      //@TODO handle error, return error response
      console.log(error);
    }
  } else {
    res.send(
      JSON.stringify({
        error: "No data to save...",
      })
    );
  }
});
app.get(API_ENDPOINTS.canvasLoad, (req, res) => {
  res.set("Content-Type", "application/json");
  const src = req.query.source;
  //now we'll read from a file
  const filePath = `canvas-json/${src}`;
  try {
    var data = fs.readFileSync(filePath, "utf8");
    res.send(
      JSON.stringify({
        success: true,
        data: data.toString(),
      })
    );
  } catch (e) {
    console.log("Error:", e.stack);
    // return error response
    res.send(
      JSON.stringify({
        error: true,
      })
    );
  }
});

app.get(API_ENDPOINTS.imagesList, (req, res) => {
  res.set("Content-Type", "application/json");
  const folder = "./public/canvas-images";
  const list = [];
  fs.readdirSync(folder).forEach((filename) => {
    list.push(filename);
  });
  res.send(
    JSON.stringify({
      success: true,
      list: list,
    })
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});