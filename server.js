const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

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

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {// default page happen on refresh
  db.collection('messages').find().toArray((err, result) => {//go to db and finds all of the
    if (err) return console.log(err)//reading the html 
    res.render('index.ejs', {messages: result})
  })
})
app.post('/messages', (req, res) => {// this is taking the form and sending it to the database
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0}, (err, result) => {
    if (err) return console.log(err)//^ this is telling the database to add one
    console.log('saved to database')
    res.redirect('/')//refrsh, back to homepage
  })
})

app.put('/messagesthumbup', (req, res) => {//update put new info
  console.log(req.body)
  console.log('thumb Up', req.body.thumbUp)
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


app.put('/messagesthumbdown', (req, res) => {//update put new info
  console.log(req.body)
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

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
