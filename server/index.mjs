import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const port = 8000;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/canvas/store", (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body) {
    //for now we'll save the canvas to .json file
    const filePath = "./canvas.json";
    let writer = fs.createWriteStream(filePath, { flags: "w" });
    writer.write(JSON.stringify(req.body));
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
  console.log(`Example app listening on port ${port}`);
});

// https://dev.to/xjamundx/adding-a-rest-api-to-your-vite-server-in-5-seconds-270g
