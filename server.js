// notes: after cloning this repo from Github, we open the terminal to get the additional node packages/etc. needed to successfully run this code and complete this project. 1) so, in the terminal we start with: npm install, npm install express --save. 2) check for all packages on left sidebar. 3) dependencies? mongoDB as part of the nodules? etc. 

const express = require('express')
const app = express()
const bodyParser = require('body-parser') //middleware for processing HTTP request body data in a Node.js application. It parses the request body data into a usable format, such as JSON or URL-encoded data, and attaches it to the req.body object, making it accessible to the application's routes and handlers.
const MongoClient = require('mongodb').MongoClient //require: dependency is loaded and has its functionality running. note: mongoDB is a module

var db, collection; //note: var is not used here because its old code, its used because of scoping

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true"; //this is the url for the mongoDB acct holding all this data. When we create our own mongoDB accounts, mongo will give us our own url to paste into this server portion of our code. 
const dbName = "demo";

app.listen(3000, () => { //listen for the localhost port we are choosing (in this case, port 3000)
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!"); //i.e. this is what we see to know that when we run node server, this msg tells us its running successfully. you will want to include a console.log like this for your projects as a helpful visual
    });
});

app.set('view engine', 'ejs') //used to set the default view engine for the application to EJS (Embedded JavaScript). This means that when a route handler renders a view, Express will look for an EJS template file with the same name as the view and use it to render the HTML output that will be sent back to the client.
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => { //indicating file path we are seeking to get. now note CRUD here and in lines below
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => { 
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages/thumbUp', (req, res) => { //we added specific file paths to our arrays in main.js, necessary here and for thumbDown as well 
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1}, //sorting from bottom to top in terms of where to get things from 
    upsert: true //in lieu of the above, if nothing, then it will create a new doc to serve this purpose 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.put('/messages/thumbDown', (req, res) => { //note file path here (after messages/)
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp - 1
    }
  }, {
    sort: {_id: -1}, //sorting from bottom to top in terms of where to get things from 
    upsert: true //in lieu of the above, if nothing, then it will create a new doc to serve this purpose 
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
