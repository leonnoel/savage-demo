require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const { ObjectID } = require('mongodb')

let db, collection; // lets you declare two variables

const configDB = {"url":process.env.MONGODB_URI}
const dbName = "demo";
console.log(configDB)

app.listen(3000, () => {
  MongoClient.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs') // lets us plug in html onto client side
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // lets us submit stuff using forms 
app.use(express.static('public')) // whatever you put in this public folder is hosted

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { messages: result }) // this renders an HTML file
  })
})

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/increaseCounterInMongoDB', (req, res) => {
  console.log('This is a request to increment counter')
  console.log(req)
  db.collection('messages')
    .findOneAndUpdate({
      _id: new ObjectID(req.body.lookUpThisIDinMongoDB) // this thing is a class, 
    }, {
      $set: {
        thumbUp: req.body.counter + 1
      }
    }, {
      sort: { _id: -1 },
      upsert: true // irrelevant, it can't create a new thumbs up
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.put('/decreaseCounterInMongoDB', (req, res) => {
  console.log('This is a request to decrement counter')
  console.log(req)
  db.collection('messages')
    .findOneAndUpdate({
      _id: new ObjectID(req.body.lookUpThisIDinMongoDB) // this thing is a class, 
    }, {
      $set: {
        thumbUp: req.body.counter - 1
      }
    }, {
      sort: { _id: -1 },
      upsert: true // irrelevant, it can't create a new thumbs up
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

//     .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
//       $set: {
//         thumbUp: req.body.counter - 1
//       }
//     }, {
//       sort: { _id: -1 },
//       upsert: true // irrelevant, it can't create a new thumbs up
//     }, (err, result) => {
//       if (err) return res.send(err)
//       res.send(result)
//     })
// })

app.delete('/deleteAdocument', (req, res) => {
  db.collection('messages').findOneAndDelete({ _id: new ObjectID(req.body.lookUpThisIDinMongoDB) },
    (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
})


// how do you globally add a new property to your documents in your MongoDB collection? 