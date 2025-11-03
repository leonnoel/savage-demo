const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
//help with mau and Sherrell together
var db, collection;
<<<<<<< HEAD

// a data base leon created, whole class is using this DB
// mongodb+srv://alouidorm_db_user:RCprojects2025@cluster0.07r6baa.mongodb.net/?appName=Cluster0
=======
// a data base leon created, whole class is using this DB
>>>>>>> b5aea2b80a1a09a95bbc00972192a9039f10a410
const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const dbName = "demo";

app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});
<<<<<<< HEAD

=======
>>>>>>> b5aea2b80a1a09a95bbc00972192a9039f10a410
//setting up middleware
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))
<<<<<<< HEAD

=======
>>>>>>> b5aea2b80a1a09a95bbc00972192a9039f10a410
//getting page host 3000, messages from DB, db.collection is for mongo DB
app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { messages: result })
  })
})
<<<<<<< HEAD

=======
>>>>>>> b5aea2b80a1a09a95bbc00972192a9039f10a410
//creating or adding data in DB, whenever you see post its adding
app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
<<<<<<< HEAD

// put is for updating, 
app.put('/messages', (req, res) => {
  const isUp = Object.keys(req.body).includes("thumbUp");
  //checking if its sending thumbs up the add 1 or subtract one
  //question mark checks for true or false
  const thumbValue = isUp ? req.body.thumbUp + 1 : req.body.thumbDown - 1;
  console.log(isUp, thumbValue)
  db.collection('messages')
    .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
=======
// put is for updating, 
app.put('/messages', (req, res) => {
  console.log(req.body)
  //Object.keys(req.body) => ['name', 'msg', 'thumbDown']
  // .includes check an array of value, checking for thumbs up in array
  // add variable to object.keys
  const thumb = Object.keys(req.body).includes('thumbUp')
  //question mark checks for true or false
  const thumbValue = thumb ?
    req.body.thumbUp + 1 :
    req.body.thumbDown - 1;
  db.collection('messages')
    .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {

>>>>>>> b5aea2b80a1a09a95bbc00972192a9039f10a410
      $set: {
        thumbUp: thumbValue
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
<<<<<<< HEAD
=======

>>>>>>> b5aea2b80a1a09a95bbc00972192a9039f10a410
//help with Maureen and Sherrell, done all together
