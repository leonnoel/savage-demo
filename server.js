// Step 1: Set up the playground (web server) using Express
const express = require('express')
const app = express()

// Step 2: Get helpers to understand what people say
const bodyParser = require('body-parser')

// Step 3: Bring in a tool to talk to the MongoDB toy box
const MongoClient = require('mongodb').MongoClient

// Step 4: Create boxes to store playground and toys
var db, collection;

// Step 5: Secret code to connect to the MongoDB toy box on the internet
const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";

// Step 6: Name the toy storage room
const dbName = "demo";

// Step 7: Open the playground (web server) for people to visit
app.listen(3000, () => {
  // Step 8: Connect to the MongoDB toy box
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        // Step 9: Store the playground
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

// Step 10: Set up a way to show pretty pictures and messages on the playground
app.set('view engine', 'ejs')

// Step 11: Teach the playground to understand what people say and send us
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Step 12: Add a place for pictures (posters) on the playground
app.use(express.static('public'))

// Step 13: Show a list of toys (messages) when people visit the playground's main entrance
app.get('/', (req, res) => {
  // Step 14: Look into our toy storage and display the list of toys (messages)
  db.collection('messages').find().sort({thumb: -1}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  // Step 16: Add the new toy (message) to our toy box
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumb: 0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// Step 17: Listen to people if they want to change a toy (message)
app.put('/messages', (req, res) => {
  // Step 18: Update the toy in our toy box
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $inc: {
      thumb: req.body.thumb
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result.value)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
