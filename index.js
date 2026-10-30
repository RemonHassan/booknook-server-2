import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cors());

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
const mongoClient = await connectToMongoDB();
// database create
const db = mongoClient.db("booknook");
const bookCollection = db.collection("book");

// ADDING the "add-book" 📚
app.post("/add-book", async (req, res) => {
  const data = req.body;
  const result = await bookCollection.insertOne(data);
  console.log(result);
  res.send(result);
});
// Getting all books
app.get("/books", async (req, res) => {
  const result = await bookCollection.find().toArray();
  res.send(result);
});
// Home page URL 🏠
// http://localhost:4000/books
app.get("/", (req, res) => {
  res.send("Hello BookNook!!!!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
