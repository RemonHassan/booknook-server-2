import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const PORT = 4000;
app.use(express.json());
// Home page URL 🏠
app.get("/", (req, res) => {
  res.send("Hello BookNook!!!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
