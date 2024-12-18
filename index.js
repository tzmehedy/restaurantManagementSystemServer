const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("restaurant management system menu is coming")
})
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
    const cartsCollections = client.db("BistroBoss").collection("allcarts")
    const usersCollections = client.db("BistroBoss").collection("allusers")
    
    // jwt
    app.post("/jwt", async(req,res)=>{
      const user = req.body 
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'});
      res.send({token})
    })

    app.get("/menus", async(req,res)=>{
        const result = await menusCollections.find().toArray()
        res.send(result)
    })

    app.post("/carts", async(req,res)=>{
      const cartItem = req.body
      const result = await cartsCollections.insertOne(cartItem)
      res.send(result) 
    })

    app.get("/carts", async(req,res)=>{
      const email = req.query.email 
      const query = {userEmail:email}
      const result = await cartsCollections.find(query).toArray()
      res.send(result)
    })

    app.delete("/carts/:id", async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await cartsCollections.deleteOne(query)
      res.send(result)
    })

    app.get("/users", async(req,res)=>{
      const result = await usersCollections.find().toArray()
      res.send(result)
    })

    app.post("/users", async(req,res)=>{
      const user = req.body 
      const result = await usersCollections.insertOne(user)
      res.send(result)
    })

    app.delete("/users/:id", async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await usersCollections.deleteOne(query)
      res.send(result)
    })

    app.patch("/users/admin/:id", async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const updateDoc = {
        $set:{
          role:"admin"
        }
      }
      const result = await usersCollections.updateOne(query, updateDoc)
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