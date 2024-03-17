import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

// import { fabric } from "fabric"; // v5
import { TatumSDK, Network } from "@tatumio/tatum";
import { API_ENDPOINTS, ORIGIN_BASE, TATUM_KEY } from "./config.mjs";
import sharp from 'sharp'

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
  const img = fs.readFileSync(`${filePath}`);
  return Buffer.from(img).toString("base64");
}

const tatumClient = await TatumSDK.init({
  network: Network.Polygon,
  // network: Network.POLYGON,
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
    // @TODO setup canvas metadata to be the same as when Save btn is clicked, drawing-ui

    try {
      
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log(`Directory ${subDir} created successfully`);
        }
      
      //# create .png and save it on disk
      sharp(Buffer.from(req.body.image))
      .png()
      .toFile(filePath)
      .then(async (info)=>{ 
        const base64String = toBase64(filePath);
    
     
        const buffer = fs.readFileSync(filePath); 
      // returns the CID of the stored data
      const imageIPFS = await tatumClient.ipfs.uploadFile({
        file: buffer,
      });

      const metaData = JSON.stringify({
        name: "Cartesi Drawing Board NFT",
        description:
          "Collaborative drawings powered by Cartesi Rollups and Sunodo.",
        // image: "ipfs://" + imageIPFS.data.ipfsHash,
        image: "https://gateway.pinata.cloud/ipfs/" + imageIPFS.data.ipfsHash
      });
      console.log(`Check the uploaded image: https://ipfs.io/ipfs/${imageIPFS.data.ipfsHash}`)
      console.log(`Check the uploaded image: https://gateway.pinata.cloud/ipfs/${imageIPFS.data.ipfsHash}`)
      const metaIPFS = await tatumClient.ipfs.uploadFile({
        file: metaData,
      });
      console.log(`Check the uploaded file: https://ipfs.io/ipfs/${metaIPFS.data.ipfsHash}`)
      console.log(`Check the uploaded file: https://gateway.pinata.cloud/ipfs/${metaIPFS.data.ipfsHash}`)


      res.send(
        JSON.stringify({
          success: true,
          base64out: base64String,
          ipfsHash: metaIPFS.data.ipfsHash,
        })
      );

      tatumClient.destroy();
      })
      .catch(err => { console.log(err) });; // @TODO - update filapath and name 
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
