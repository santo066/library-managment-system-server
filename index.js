const express = require("express");
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//mid
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oyebmuz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const CategorysCollection = client.db('BookDB').collection('bookCategorys');
        const booksCollection = client.db('BookDB').collection('Allbooks');
        const bookingsCollection = client.db('BookDB').collection('Booking');

        //CATEGORYS
        app.get('/category', async (req, res) => {
            const cursor = CategorysCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await CategorysCollection.findOne(query)
            res.send(result)
        })
        //ADD BOOK SECTION

        app.post('/book', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book)
            res.send(result)
        })
        app.get('/book', async (req, res) => {
            const cursor = booksCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await booksCollection.findOne(query)
            res.send(result)
        })
        app.put('/book/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const update = {
                $set: {
                    name: data.name,
                    author: data.author,
                    category: data.category,
                    price: data.price,
                    description: data.description,
                    image: data.image,
                    ratting: data.ratting
                }
            }
            const result = await booksCollection.updateOne(filter, update, option)
            res.send(result)
        })

        //bookings

        app.get('/booking', async (req, res) => {
            console.log(req.query.email)
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/booking', async (req, res) => {
            const bookingbook = req.body;
            console.log(bookingbook)
            const result = await bookingsCollection.insertOne(bookingbook);
            res.send(result)
        })
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query)
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('my book server is running')
})
app.listen(port, (req, res) => {
    console.log('my port is ', port)
})