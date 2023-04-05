import { MongoClient } from "mongodb";
const uri =
  "mongodb+srv://drawing-dapp:0q82DoYcZTPIecz4@drawingdapp.u7u6jzc.mongodb.net/?retryWrites=true&w=majority";

export const Conn = () => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const database = client.db("drawing");
  const collection_images = database.collection("images");
  var _db;

  const connectToServer = async () => {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("drawing");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
    // await client.connect();
    // await listDatabases(client);
  };
  const getDb = () => {
    console.log(_db);
    return _db;
  };

  const listDatabases = async (client) => {
    const databasesList = await client.db().admin().listDatabases();
    // const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  };
  const getImages = async () => {
    const r = await collection_images.find().toArray();
    return r;
  };

  return { connectToServer, getDb, getImages };
};
