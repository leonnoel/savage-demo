const express = require('express') //  briniging in the expresss module 
const app = express() // storing the express module
const bodyParser = require('body-parser') // bringing in the body parser module. Body parse is middleware (response handler, primary role is to parse the data from the http request ), helps to tiddy up the request object before 
const MongoClient = require('mongodb').MongoClient // bringing in MongoDB modulewhich connect us to the MongoDB Client Database 

var db, collection; // is creating empty variables for db and collection

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";// this is the connection string to get to the mongo database/cluster (database) url
const dbName = "demo";// this is the name of his database from mongo db

app.listen(3000, () => {// connected to data this is using express to listen to the server 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => { // connects us to MongoDB w/ the connection string url. Uses headers and params of error and client 
        if(error) {// catch errors 
            throw error;
        }
        db = client.db(dbName);// taking the global variable of db and setting it to the client database's name 
        console.log("Connected to `" + dbName + "`!");//when connected console should log connected to with the dbName variable 
    });
});

app.set('view engine', 'ejs')// this is where we tell the engine to use ejs to render on that pg// sets the view engine for rendering dynamic web pages to ejs (Embedded JavaScript) template 
app.use(bodyParser.urlencoded({extended: true}))// The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.
app.use(bodyParser.json()) // configures middleware parses incomuing http request bodies with JSON Data
app.use(express.static('public')) //dont have to make a public route for assets , just use this line and place assets in public folder 

app.get('/', (req, res) => { //Making a get request (reads) the endpoint, the "/" is the endpoint of the homepage
  db.collection('messages').find().toArray((err, result) => {// got to your database find a collection of messages, find() method finds those messages  and turns each of those objects into an array and stored it in result and catches the error 
    if (err) return console.log(err)// if error console.log error 
    res.render('index.ejs', {messages: result}) // render out response from index.ejs, try to render a template: rendering response into html templateand passes data to the template. The template in this case is the index.ejs 
  })
})

app.post('/messages', (req, res) => {
  console.log("post method")
   //event handler(ex: here a function i want you to run in the future)// creating request from user//Making a post request (create) to the endpoint, the "/messages" is the endpoint of where the message data will be handled 
  console.log(req)// console logging the request data 
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => { // inserts a new document (record) into the message collection with hardcoded properties " thumbsUp: 0, thunmbsDown : 0 )"
    if (err) return console.log(err)//if error, console.log error 
    console.log('saved to database')// if no errors console log saved to database 
    res.redirect('/')// redirect response to home endpoint 
  })
})

app.put('/messages', (req, res) => {// the values we send from the fetch request
  console.log("thumb like (put method):" )
  // db.collection("messages").findOneAndUpdate(
  //   { name: req.body.name, msg: req.body.msg },
  //   {
  //     $set: { // the set it what we are updating likes or dislikes with thumbs up (mongo synteax uses $ser:
  //       thumbUp: req.body.thumbUp + 1,
  //     },
  //   },
  //   {
  //     sort: { _id: -1 },//used for a dataset for sorting operations whether string integers decimals etc.. (helps w/ readability), the one is used to stack the dataset at the very end 
  //     upsert: true,// when you update it , it updates into db /( update + insert = upsert)
  //   },
  //   (err, result) => {
  //     if (err) return res.send(err);
  //     res.send(result);
  //   }
  // );
})

app.put("/messages", (req, res) => {
  console.log("thumb Dislike (put method) :");
  // the values we send from the fetch request
  // db.collection("messages").findOneAndUpdate(
  //   { name: req.body.name, msg: req.body.msg },
  //   {
  //     $set: {
  //       // the set it what we are updating likes or dislikes with thumbs up (mongo synteax uses $ser:
  //       thumbDown: req.body.thumbDown - 1,
  //     },
  //   },
  //   {
  //     sort: { _id: -1 }, //used for a dataset for sorting operations whether string integers decimals etc.. (helps w/ readability), the one is used to stack the dataset at the very end
  //     upsert: true, // when you update it , it updates into db /( update + insert = upsert)
  //   },
  //   (err, result) => {
  //     if (err) return res.send(err);
  //     res.send(result);
  //   }
  // );
});


app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


// Embedded JavaScript
// middleware is anything  btwn the request and response
// get to 