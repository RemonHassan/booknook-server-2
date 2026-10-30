import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const PORT = 4000;
app.use(express.json());

// conncection to MONGO-DB 💽
const client = new MongoClient(process.env.MONGODB_URL);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

// Home page URL 🏠
app.get("/", (req, res) => {
  res.send("Hello BookNook!!!!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
