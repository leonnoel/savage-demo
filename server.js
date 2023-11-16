const express = require('express') // using express
const app = express() // Initiates an instance of Express and stores it in the variable app, enabling the creation of routes and handling HTTP requests.
const bodyParser = require('body-parser')// body parser module helps tidy up the request objects before use it. Node speciifc function 
const MongoClient = require('mongodb').MongoClient // using mongo

var db, collection;// creatinf db nand vb

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true"; // url from mongo db cluster,  Defines the connection URL for the MongoDB database, including credentials and necessary details to connect to a specific cluster.
const dbName = "demo"; // database name, Specifies the name of the database to be used within MongoDB.

app.listen(4000, () => { // Starts the server on port 3000 and establishes a connection to the MongoDB database. Upon successful connection, it logs a message.
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {// connects us to MongoDB string url. Uses headered and paramer of error nd client
        if(error) {
            throw error;
        }
        db = client.db(dbName);// taking global variabel db and setiin git to the client database
        console.log("Connected to `" + dbName + "`!"); // when connected console hould log connected to dbname
    });
});

app.set('view engine', 'ejs') //Sets the view engine for dynamic web pages to 'ejs'embedded js template for rendering HTML templates.
app.use(bodyParser.urlencoded({extended: true})) // tells the body parser to extract data from the form element and add them to body propery in the request object
app.use(bodyParser.json())//  configures middelware that parses incoming htttps request bodies with json dataConfigures Express to use the body-parser middleware for handling URL-encoded and JSON data from incoming requests.
app.use(express.static('public')) //  Configures Express to use the body-parser middleware for handling URL-encoded and JSON data from incoming requests.

app.get('/', (req, res) => { // Handles GET requests on the root route. Retrieves messages from the MongoDB 'messages' collection and renders them in the 'index.ejs' template.
  db.collection('messages').find() .sort({ thumbUp: -1 }).toArray((err, result) => {// used to acesdd specific collection within your mongodb databased fid()  used to empty and etreve documet sfrom  collction as it has no argumetn it fetches all documetns from the  collection toArrya() is takig all the documentsfrom collection and vrign it inti an arrya 
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => { //  Handles POST requests to insert a new message into the 'messages' collection.
  console.log(req)
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => { // Handles PUT requests to update an existing message with a thumbs-up count.
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
app.put('/messagesdown', (req, res) => { // Handles PUT requests to update an existing message with a thumbs-up count.
console.log(req.body)
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp -1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => { // Handles DELETE requests to remove a specific message from the collection.
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
