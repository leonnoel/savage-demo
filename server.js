const express = require('express') //access express function
const app = express() // app is telling express function to run
const bodyParser = require('body-parser') //access body parser module
const MongoClient = require('mongodb').MongoClient //access mongodb 

var db, collection; //declares variable to use late

const url = 'mongodb+srv://kellychhe:Poop00@cluster0.2unid.mongodb.net/?retryWrites=true&w=majority'
const dbName = "demo"; //name of database

app.listen(3000, () => { // listening on port 3000
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });// lets us know we have successfully connected to the database
});

app.set('view engine', 'ejs') // has to come before use, get, and post. tells express to use ejs when we ask it to render
app.use(bodyParser.urlencoded({extended: true})) // body parser will be applied to url
app.use(bodyParser.json()) // body parser will be applied to strigified JSON 
app.use(express.static('public')) //anything in this public folder, it is ran on server immediately no route needed

app.get('/', (req, res) => { //get request for when the page is loaded and url contians '/' -- or invisible slash
  db.collection('messages').find().toArray((err, result) => { // gathering all the messages in the database and putting them into an array
    if (err) return console.log(err) // if something is wrong plssss tell me
    res.render('index.ejs', {messages: result}) // put the messages into index.ejs so that it will render the messages on the DOM
  })
})

app.post('/messages', (req, res) => { // post request creates a document 
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => { //insert one creates document and adds it to collection is where db info is stored in mongodb
    //user input does not affect thumbup and down because they are hard coded into the message
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => { // update request after some action
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, { // we are finding the name/message in the db that matches the name/message targeted my main.js event listener
    $set: {  
      thumbUp:req.body.thumbUp + 1 // adds one to thumbUp value
    }
  }, {
    sort: {_id: -1},
    upsert: true 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/thumbDown', (req, res) => { // update request after some action
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, { // we are finding the name/message in the db that matches the name/message targeted my main.js event listener
    $set: {  
      thumbUp:req.body.thumbUp - 1 // adds one to thumbDown value
    }
  }, {
    sort: {_id: -1},
    upsert: true 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => { // a delete request
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => { // find matching name/message object in database and delete it
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
