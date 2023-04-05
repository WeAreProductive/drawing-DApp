import express from "express";
import cors from "cors";
import recordRoutes from "./routes/index.mjs";
import { dbConnect } from "./db/index.js";
const app = express();

const port = 8000;

app.use(cors());
app.use(express.json());
app.use(recordRoutes);
const { connectToServer } = dbConnect();//test db connection
app.listen(port, () => {
  // perform a database connection when server starts
  connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
