import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
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
const borrowingCollection = db.collection("borrowing");

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
// getting a sigleBook for details
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  const result = await bookCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});
// getting all books by email
app.get("/books/user/:email", async (req, res) => {
  const { email } = req.params;
  const result = await bookCollection.find({ email: email }).toArray();
  res.send(result);
});

// Edit Books
app.patch("/books/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await bookCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData },
  );
  res.json(result);
});

// DELETE api
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  const result = await bookCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.json(result);
});

// Borrowing
app.post("/borrowing", async (req, res) => {
  const data = req.body;
  const result = await borrowingCollection.insertOne(data);
  res.send(result);
});
app.get("/my-borrowing/:email", async (req, res) => {
  const { email } = req.params;
  const result = await borrowingCollection.find({ email: email }).toArray();
  res.send(result);
});

// Home page URL 🏠
// http://localhost:4000/my-borrowing/:email
app.get("/", (req, res) => {
  res.send("Hello BookNook!!!!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
