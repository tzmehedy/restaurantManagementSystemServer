const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("restaurant management system menu is coming")
})


console.log(process.env.DB_USER)
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k8aq9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const menusCollections = client.db("BistroBoss").collection("allMenus")
    console.log(menusCollections)

    app.get("/menus", async(req,res)=>{
        const result = await menusCollections.find().toArray()
        res.send(result)
    })
    
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.listen(port, ()=>{
    console.log(`The server is running on the port of ${port}`)
})