import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { MongoClient } from "mongodb";
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@drawingdapp.u7u6jzc.mongodb.net/?retryWrites=true&w=majority`;

export const dbConnect = () => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const database = client.db("drawing");
  const collection_images = database.collection("images");
  var _db;
  /**
   * test db connection
   */
  const connectToServer = async () => {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("drawing");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  };
  /**
   * List available dbs
   * @param {*} client
   */
  const listDatabases = async (client) => {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  };
  /**
   * Get all svgs
   * @returns array of svg images data
   */
  const getImages = async () => {
    const r = await collection_images.find().toArray();
    return r;
  };

  return { connectToServer, getImages };
};
