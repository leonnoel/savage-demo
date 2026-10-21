// modules utilized and downloaded to have cleaner code and enable functionability that was not available prior to download/install
const express = require('express') //utlizied for cleaner code and organizes the code, it is the steering wheel for the node engine block
const app = express() // giving express a variable that will be called later, wherever you see app it is utlizing the express module
const bodyParser = require('body-parser') // semi-depracated, in newer ES models it is now embedded within JS 
const MongoClient = require('mongodb').MongoClient // setting up the database with which you will store data

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";  // found within the database
const dbName = "demo"; //  giving the database a name

// down here is where we set up the server, and which port the database and files will render on, we connect it to the db and set it up
app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs') // setting up the ejs which is "embedded javaScript" 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public')) // utilized the static functionality local to express that enables files within a folder to be displayed and connected easier?

app.get('/', (req, res) => {  //the req is the data that we are searching for, and res is the response from the information that we had recieved
  db.collection('messages').find().toArray((err, result) => { // we use the database to look for a collection which we created within the database and utilized to store data, we find it and all its information and turn it into an array to return back as  a response
    if (err) return console.log(err) // all i know is if problem, this catches it
    res.render('index.ejs', { messages: result }) // this is where we tell JS to render the ejs file that contains the data that is displayed to the client, ejs allows for interchangeable data(i think)
  })
})

app.post('/messages', (req, res) => { // this is where we add documents
  db.collection('messages').insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  db.collection('messages')
    .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
      $inc: {
        thumbUp: req.body.change
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
