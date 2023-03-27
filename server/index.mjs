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
app.use(bodyParser.json({ limit: "1mb" }));//@TODO - set here proper limit to allow canvas to be saved properly

app.post("/canvas/store", (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body) {
    try {
      //for now we'll save the canvas to .json file
      const filePath = "./canvas.json";
      let writer = fs.createWriteStream(filePath, { flags: "w" });
      writer.write(JSON.stringify(req.body));
      res.send(
        JSON.stringify({
          success: true,
        })
      );
    } catch (error) {
      res.send(
        JSON.stringify({
          error: error.stack,
        })
      );
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
app.get("/canvas/load", (req, res) => {
  res.set("Content-Type", "application/json");
  //here we'll get canvas Id(?) to load from the request
  //now we'll read from a file
  const filePath = "./canvas.json";
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// https://dev.to/xjamundx/adding-a-rest-api-to-your-vite-server-in-5-seconds-270g
