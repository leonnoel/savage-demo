
// my goal is for user to input their date and they are given their signs based on the data from
//the API.  they can then input it and ????
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;
//URL from mongodb website cluster
//MAKE SURE TO CHANGE THIS TO MISTYFOXSONG AND THE HOROSCOPE PROJECT
const url = "mongodb+srv://mistyfoxsong:1234@cluster0.ndqi8wd.mongodb.net/Horoscope?retryWrites=true&w=majority";
const dbName = "Horoscope";

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

//this request is making a READ/GET request from the root and asking it to retrieve
//everything it knows about the request and response.
// it go into the database, into the collection called "messages" and find the data
//turn the data into an Array. If there's an error, let us know, if not, render the index.ejs
//page and display the object (document) from our database from messages collection and the result data
app.get('/', (req, res) => {
  db.collection('birthChart').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {birthChart: result})
  })
})
//THIS WAS CHANGED TO birthChart
app.post('/birthChart', (req, res) => {
  function check() {

    let month = new Date(document.querySelector("#birthday").value).getMonth() + 1
    let day = new Date(document.querySelector("#birthday").value).getDate() + 1
  
  
  
  
    if (month == 1 && day >= 21 || month == 2 && day <= 22) {
      sun = Aquarius
    }
  
    else if (month == 2 && day >= 21 || month == 3 && day <= 22) {
  
      sun = Pisces
    }
  
    else if (month == 3 && day >= 21 || month == 4 && day <= 22) {
  
      sun = Aries
    }
  
    else if (month == 4 && day >= 21 || month == 5 && day <= 22) {
  
      sun = Taurus
    }
  
    else if (month == 5 && day >= 21 || month == 6 && day <= 22) {
      sun = Gemini
  
    }
  
  
    else if (month == 6 && day >= 21 || month == 7 && day <= 22) {
      sun = Cancer
    }
  
    else if (month == 7 && day >= 21 || month == 8 && day <= 22) {
      sun = Leo
    }
  
    else if (month == 8 && day >= 21 || month == 9 && day <= 22) {
      sun = Virgo
    }
  
    else if (month == 9 && day >= 21 || month == 10 && day <= 22) {
      sun = Libra
    }
  
    else if (month == 10 && day >= 21 || month == 11 && day <= 22) {
      sun = Scorpio
    }
  
    else if (month == 11 && day >= 21 || month == 12 && day <= 22) {
      sun = Sagittarius
    }
  
    else if (month == 12 && day <= 22 || month == 1 && day <= 21) {
      sun = Capricorn
    }
  
  }
  db.collection('birthChart').insertOne({date: req.body.date, sun: req.body.sun, moon: req.body.moon, venus: req.body.venus}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// app.put('/messages', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbUp:req.body.thumbUp + 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

//logic for thumbs down goes here =================
// app.put('/messages', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
      
//       thumbDown:req.body.thumbDown - 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

app.delete('/birthChart', (req, res) => {
  db.collection('birthChart').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
