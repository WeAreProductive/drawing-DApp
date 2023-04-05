import express from "express";
import cors from "cors";
import recordRoutes from "./routes/index.mjs";
import { Conn } from "./db/conn.mjs";
const app = express();

const port = 8000;

app.use(cors());
app.use(express.json());
app.use(recordRoutes);
const { connectToServer } = Conn();
app.listen(port, () => {
  // perform a database connection when server starts
  connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
