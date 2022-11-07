const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://antTheDev:Cocopuffs12@cluster0.phhdyu1.mongodb.net/contacts?retryWrites=true&w=majority";
const dbName = "contacts";

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
  db.collection('contacts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {contacts: result})
  })
})

app.post('/contacts', (req, res) => {
  db.collection('contacts').insertOne({name:req.body.name, email:req.body.email, phone:req.body.phone,favorite:false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/contacts', (req, res) => {
  console.log(req.body.email, req.body.star)
  db.collection('contacts')
  .findOneAndUpdate({ email: req.body.email}, {
    $set: {
      favorite:req.body.star 
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
