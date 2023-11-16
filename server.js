const express = require('express') //connect to express
const app = express() //set the express variable to the app variable 
const bodyParser = require('body-parser') //
const MongoClient = require('mongodb').MongoClient //set up how we talk to database

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

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

// req.name.msg is to get the message from the from
// req.name.name is to get the name from the form
app.post('/messages', (req, res) => {
  console.log(req)
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/') //triggers the GET
  })
})


//worked on making the thumbs down button with my house moses members
app.put('/messages', (req, res) => {
  const upOrDown = req.body.hasOwnProperty('thumbDown') ? 'thumbDown' : 'thumbUp'
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $inc: { //$sets something from the database and the code below allows us to SET the thumbs up to its value
      //the mongoDB docs state that using $inc with .updateOne() will increase metrics by one. thats why we use [upOrDown]: 1 
      //thumbUp:req.body.thumbUp + 1,
      //in brackets to specify the key (property name) for the object being updated in the database
      [upOrDown]: 1,
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
