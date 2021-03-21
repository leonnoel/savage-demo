const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

//mongo url is different and delete password for that demo cluster 

const url="mongodb+srv://savage:123@cluster0.gfz1v.mongodb.net/demo?retryWrites=true&w=majority"
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

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
// root of messgaes
// find a documented named name 

app.put('/messages', (req, res) => {
  db.collection('messages')
  //findOneAndUpdate is within mongoDB 
  // basically Monogo is find that and update 
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
      // thumbDown:req.body.thumbDown-1
      // finds that property and adds one into the html updating it
    }
  }, {
    //if it doesn't find anything please 
    // create it then 
    sort: {_id: -1},  //
    upsert: true  // insert a fake one and will make it 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
// thumbsDown
app.put('/thumbDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      // thumbUp:req.body.thumbUp- 1
      // thumbDown:req.body.thumbUp-1
      // thumbDown: req.body.thumbUp - 1
            thumbDown: req.body.thumbDown + 1


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
