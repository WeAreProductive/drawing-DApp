import express from "express";
import cors from "cors";
const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());
app.use(recordRoutes);
const { connectToServer } = dbConnect(); //test db connection
app.listen(port, () => {
  // perform a database connection when server starts
  console.log(`Server is running on port: ${port}`);
});
