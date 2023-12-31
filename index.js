const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9lypro.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    //server theke pawa data client e show korabo
    app.get('/coffee', async(req,res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //update a specific id data 1
    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })


    //server site e data gula nilam create korlam
    app.post('/coffee', async(req, res) => {
      const newCoffeeInfo = req.body;
      console.log(newCoffeeInfo);
      const result = await coffeeCollection.insertOne(newCoffeeInfo);
      res.send(result);
    })

    //updated 2
    app.put('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name ,
          photo: updatedCoffee.photo ,
          quantity: updatedCoffee.quantity ,
          taste: updatedCoffee.taste ,
          supplier: updatedCoffee.supplier ,
          details: updatedCoffee.details ,
          category: updatedCoffee.category 

        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);

    })


    //delete korbo akta items
    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req,res) => {
    res.send("Coffee Shop Server is running.");
});

app.listen(port, () => {
    console.log(`Coffee Shop Server is running on port: ${port}`);
})