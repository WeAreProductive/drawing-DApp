import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { fabric } from "fabric";
import { TatumSDK, Network } from "@tatumio/tatum";
import { API_ENDPOINTS, ORIGIN_BASE, TATUM_KEY } from "./config.mjs";

const port = 3000;
const corsOptions = {
  origin: ORIGIN_BASE,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1mb" })); //@TODO - set here proper limit to allow canvas to be saved properly
app.use(express.static("public")); //make the images accessible by the drawing-ui

function toBase64(filePath) {
  const img = fs.readFileSync(filePath);
  return Buffer.from(img).toString("base64");
}

const tatumClient = await TatumSDK.init({
  network: Network.Polygon,
  verbose: true,
  apiKey: {
    v4: TATUM_KEY,
  },
});

app.post(API_ENDPOINTS.canvasStore, async (req, res) => {
  res.set("Content-Type", "application/json");

  if (req.body) {
    const fullPath = `public/canvas-images/`;
    const subDir = `canvas-images`;
    const filePath = fullPath + `${req.body.filename}.png`;
    try {
      const canvas = new fabric.Canvas(null, { width: 600, height: 600 });
      canvas.loadFromJSON(
        JSON.stringify({ objects: req.body.image }),
        function () {
          canvas.setZoom(1);
          const group = new fabric.Group(canvas.getObjects());
          const x = group.left + group.width / 2 - canvas.width / 2;
          const y = group.top + group.height / 2 - canvas.height / 2;
          canvas.absolutePan({ x: x, y: y });
          const heightDist = canvas.getHeight() - group.height;
          const widthDist = canvas.getWidth() - group.width;
          let groupDimension = 0;
          let canvasDimension = 0;

          if (heightDist < widthDist) {
            groupDimension = group.height;
            canvasDimension = canvas.getHeight();
          } else {
            groupDimension = group.width;
            canvasDimension = canvas.getWidth();
          }

          const zoom = (canvasDimension / groupDimension) * 0.8;

          canvas.zoomToPoint(
            { x: canvas.width / 2, y: canvas.height / 2 },
            zoom
          );

          canvas.renderAll();

          try {
            if (!fs.existsSync(fullPath)) {
              fs.mkdirSync(fullPath, { recursive: true });
              console.log(`Directory ${subDir} created successfully`);
            }
            const out = fs.createWriteStream(filePath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on("finish", async () => {
              console.log("The PNG file was created.");
              const base64String = toBase64(filePath);
              const buffer = fs.readFileSync(filePath);
              const imageIPFS = await tatumClient.ipfs.uploadFile({
                file: buffer,
              });

              const metaData = JSON.stringify({
                name: "Cartesi Drawing Board NFT",
                description:
                  "Collaborative drawings powered by Cartesi Rollups and Sunodo.",
                image:
                  "https://gateway.pinata.cloud/ipfs/" +
                  imageIPFS.data.ipfsHash,
              });
              const metaIPFS = await tatumClient.ipfs.uploadFile({
                file: metaData,
              });

              res.send(
                JSON.stringify({
                  success: true,
                  base64out: base64String,
                  ipfsHash: metaIPFS.data.ipfsHash,
                })
              );

              tatumClient.destroy();
            });
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
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
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export const viteNodeApp = app;
