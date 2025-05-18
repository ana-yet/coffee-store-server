const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.port || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${[process.env.DB_USERNAME]}:${
  process.env.DB_PASSWORD
}@cluster0.mfkuhnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDb").collection("coffees");
    const userCollection = client.db("coffeeDb").collection("user");

    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filer = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: updatedCoffee,
      };

      const result = await coffeeCollection.updateOne(filer, updateDoc, option);
      res.send(result);
    });

    app.patch("/user", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updateUser = {
        $set: { lastSignInTime: lastSignInTime },
      };
      const result = await userCollection.updateOne(filter, updateUser);
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // user info adding
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee server is getting hotter");
});

app.listen(port, () => {
  console.log(`coffee server is running on port ${port}`);
});
