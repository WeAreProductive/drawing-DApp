import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { fabric } from "fabric";
import { TatumSDK, Network } from "@tatumio/tatum";
import { API_ENDPOINTS, ORIGIN_BASE, TATUM_KEY } from "./config.mjs";
import base64 from "base-64";

const port = 3000;
const corsOptions = {
  origin: ORIGIN_BASE,
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.static("public"));

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
    const fullPath = import.meta.env.VITE_IMG_DIR;
    const filePath = fullPath + `${req.body.filename}.png`;
    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.warn(`Directory created successfully`);
      }
      const { width, height } = req.body.canvasDimensions;
      const canvas = new fabric.Canvas(null, { width: width, height: height });
      canvas.loadFromJSON(
        JSON.stringify({ objects: req.body.image }),
        async function () {
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
          // const offsetX = (canvas.width * 1.05) / 2 || 0;
          // const offsetY = (canvas.height * 1.05) / 2 || 0;
          // const generatedSVG = canvas.toSVG({
          //   viewBox: {
          //     x: -offsetX,
          //     y: -offsetY,
          //     width: canvas.width * 1.05 || 0,
          //     height: canvas.height * 1.05 || 0,
          //   },
          //   width: canvas.width * 1.05 || 0,
          //   height: canvas.height * 1.05 || 0,
          // });

          const generatedBase64 = canvas
            .toDataURL({ format: "png" })
            .replace("data:image/png;base64,", "");

          const buffer = Buffer.from(generatedBase64, "base64");

          const imageIPFS = await tatumClient.ipfs.uploadFile({
            file: buffer,
          });

          console.warn("IPFS IMG: ", imageIPFS.data.ipfsHash);

          const metaData = JSON.stringify({
            name: "Cartesi Drawing Canvas NFT",
            description:
              "Collaborative drawings powered by Cartesi Rollups and Sunodo.",
            image:
              "https://gateway.pinata.cloud/ipfs/" + imageIPFS.data.ipfsHash,
          });

          const metaIPFS = await tatumClient.ipfs.uploadFile({
            file: metaData,
          });

          fs.writeFileSync(filePath, buffer);

          res.send(
            JSON.stringify({
              success: true,
              // base64out: base64.encode(generatedSVG), // Encoded image
              ipfsHash: metaIPFS.data.ipfsHash,
              canvasDimensions: { width: width, height: height },
            })
          );

          tatumClient.destroy();
        }
      );
    } catch (error) {
      console.error(error);
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
  console.log(
    `Server is running on port: ${port} . Accepting requests from origin: ${ORIGIN_BASE}`
  );
});

export const viteNodeApp = app;
