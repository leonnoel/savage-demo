const express = require('express') //We create a variable to store the 'express' module.
const app = express() //We create a variable to store the express function so that we can call it when we need to.
const bodyParser = require('body-parser')//We create a variable to store the body-parser module.
const MongoClient = require('mongodb').MongoClient//We create a variable to store the mongoDB module so that we can use MongoDB
var port     = process.env.PORT || 8080;

var db, 
  collection;

//This variable stores the url of our database.

const url = "mongodb+srv://anvytran:matcha@anvyrc.kuion.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//This variable stores the mongoDB cluster name. 

var dbName = 'anvyRC'

//The following function serves to connect us to our MongoDB database
 
app.listen(port, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

//The following function serves to set up express.js

app.set('view engine', 'ejs')//sets up engine to use ejs
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))//public folder which hold static assets

//The following function runs when the user visits the webpage.

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

//The following function runs when the user makes something.

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//The following function runs when the user updates something.

//app.put('/messages', (req, res) => { db.collection('messages') .findOneAndUpdate({id: req.body._id}) })

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/thumbsDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp - 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//The following function runs when the user deletes something.

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
