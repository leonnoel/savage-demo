const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection; //open collaborative database Leon created so we can all contribute to the project

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const dbName = "demo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs') //google
app.use(bodyParser.urlencoded({extended: true})) //app.use means the server is using middle i.e express
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => { //app.get is getting information for localhost3000 on pageload b/c of '/'
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => { //post is creating new data or new record to the database
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// Create (POST), Read (GET), Update (UPDATE), Delete (DELETE)
app.put('/messages', (req, res) => { //updating changes/data. Changing something that already exists
console.log(req.body) 
 // will give you an array of all the properties i.e Object.keys(req.body) => ['name', 'msg', 'thumbDown']
  //line 48 is ternary operator
const thumb = Object.keys(req.body).includes('thumbUp') // .includes checks if thumbs up is in the array
const thumbValue = thumb ? 
//checking if thumb is true or false. If true +1, if false -1
    req.body.thumbUp + 1: 
    req.body.thumbDown - 1;

db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, { //whatever we pass into the parameter, it grabs that info .(findOneandUpdate is specific to Mongo db) to make an update
    
    $set: {
      thumbUp: thumbValue
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => { //deleting from the Mongodb database
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

// Completed with Maureen and MJ in group study session