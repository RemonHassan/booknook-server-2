import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

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
// Middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const JWKS = createRemoteJWKSet(
    new URL("http://localhost:3000/api/auth/jwks"),
  );
  try {
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch (error) {
    return res.status(500).send({ message: "server error" });
  }
};

// ADDING the "add-book"
app.post("/add-book", verifyToken, async (req, res) => {
  const data = req.body;
  const result = await bookCollection.insertOne(data);
  console.log(result);
  res.send(result);
});
// new Books
// Ensure this route is placed BEFORE app.get("/books/:id") in index.js
app.get("/books/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await bookCollection
      .find({ addedDate: { $exists: true, $ne: null } }) // Only match documents with a valid addedDate
      .sort({ addedDate: -1 })
      .limit(6)
      .toArray();

    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ error: "Failed to fetch new arrivals" });
  }
});
// Getting all books
app.get("/books", async (req, res) => {
  const result = await bookCollection.find().toArray();
  res.send(result);
});
// getting a sigleBook for details
app.get("/books/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await bookCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});
// getting all books by email
app.get("/books/user/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  const result = await bookCollection.find({ email: email }).toArray();
  res.send(result);
});

// Edit Books
app.patch("/books/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await bookCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData },
  );
  res.json(result);
});

// DELETE api
app.delete("/books/:id", verifyToken, async (req, res) => {
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
app.get("/my-borrowing/:email", verifyToken, async (req, res) => {
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
