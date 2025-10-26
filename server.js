const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://fadmabelkhouraf_db_user:tawkkaijlkhn@cluster0.drpkeb1.mongodb.net/";
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

app.get('/', (req, res) => {
  db.collection('messages').find().sort({likes:1}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({
    name: req.body.name, 
    thumbUp: 0,
    thumbDown: 0
  }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err); 
    }
    console.log('saved to database');
    res.redirect('/');
  });
});

app.put('/messages', (req, res) => {
  let thumblog
  console.log('Up', req.body.thumbUp,'Down',req.body.thumbDown)
  if(Object.keys(req.body)[1] == 'thumbUp'){
    thumblog =req.body.thumbUp +1
  }else if(Object.keys(req.body)[1] == 'thumbDown'){
      thumblog =req.body.thumbDown -1
  }
  console.log(Object.keys(req.body)[1] )
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name}, {
    $set: {
      thumbUp:thumblog
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
  db.collection('messages').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
