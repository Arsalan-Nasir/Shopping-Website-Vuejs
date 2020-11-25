import bodyParser from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";
import path from "path";

const app = express();
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "../assets")));

app.get("/api/products", async (req, res) => {
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("vuedb");
  const products = await db
    .collection("products")
    .find({})
    .toArray();
  res.status(200).json(products);
  client.close();
});

app.get("/api/users/:userId/cart", async (req, res) => {
  const { userId } = req.params;
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("vuedb");
  const user = await db.collection("users").findOne({ id: parseInt(userId) });
  if (!user) return res.status(404).json("Could not find user!");
  const cartItems = user.cartItems;
  res.status(200).json({ cartItems });
  client.close();
});

app.get("/api/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("vuedb");
  const product = await db
    .collection("products")
    .find({ id: parseInt(productId) })
    .toArray();

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json("Could not find the product!");
  }
  client.close();
});

app.post("/api/users/:userId/cart", async (req, res) => {
  const { product } = req.body;
  const { userId } = req.params;
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("vuedb");

  await db
    .collection("users")
    .updateOne({ id: parseInt(userId) }, { $addToSet: { cartItems: product } });
  const user = await db.collection("users").findOne({ id: parseInt(userId) });
  const cartItemsId = user.cartItems;
  res.status(200).json({ cartItemsId });
  client.close();
});

app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
  const { productId, userId } = req.params;
  const { product } = req.body;
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("vuedb");
  // await db.collection("users").updateOne({
  //   $pull: { cartItems: productId },
  // });
  const user = await db.collection("users").findOne({ id: parseInt(userId) });
  let updatedCartItem = user.cartItems.filter(
    (item) => item.id !== parseInt(productId)
  );
  console.log(">>>>>", updatedCartItem);
  //  updatedCartItem = { id: parseInt(userId), cartItems: updatedCartItem };
  await db
    .collection("users")
    .updateOne(
      { id: parseInt(userId) },
      { $set: { cartItems: updatedCartItem } }
    );
  //await db.collection("users").findOneAndDelete({ id: parseInt(productId) });
  const user1 = await db.collection("users").findOne({ id: parseInt(userId) });
  res.status(200).json(user1.cartItems);
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
