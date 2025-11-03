const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const url = 'mongodb+srv://workamohamed_db_user:test123@cluster0.mbacbks.mongodb.net/Anime?appName=Cluster0';
const dbName = "Anime";

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to Database')
    const db = client.db(dbName)
    const quotesCollection = db.collection('Poetry')

    console.log("Connected to `" + dbName + "`!");

    app.get('/', (req, res) => {
      quotesCollection.find().toArray().then(result => {
        console.log(result)
        res.render('index.ejs', { Poetry: result })
      })
        .catch(error => console.log(error))
    })

    app.post('/quotes', (req, res) => {
      const name = req.body.name?.trim();
      const quote = req.body.quote?.trim();

      if (!name || !quote) {
        console.log('Skipped empty entry');
        return res.redirect('/');
      }

      quotesCollection.insertOne({ name, quote, thumbUp: 0 })
        .then(result => {
          console.log(result)
          res.redirect('/')
        })
        .catch(error => console.log(error))
    })

    app.put('/messages', (req, res) => {
      quotesCollection
        .findOneAndUpdate({ name: req.body.name.trim(), quote: req.body.quote.trim() },
          {
            $set: {
              thumbUp: req.body.thumbUp + 1
            }
          }, {
          sort: { _id: -1 },
          upsert: false
        })
        .then(result => {
          res.json('Success')
        })
        .catch(error => {
          console.error(error)
          res.status(500).send(error)
        })
    })

    app.put('/messagesDown', (req, res) => {
      quotesCollection
        .findOneAndUpdate({ name: req.body.name.trim(), quote: req.body.quote.trim() }, {
          $set: {
            thumbUp: req.body.thumbUp - 1
          }
        }, {
          sort: { _id: -1 },
          upsert: false
        })
        .then(result => {
          res.json('Success')
        })
        .catch(error => {
          console.error(error)
          res.status(500).send(error)
        })
    })


    app.delete('/delete', (req, res) => {
      console.log('Delete request received:', req.body);  // Add this line
      quotesCollection
        .deleteOne({ name: req.body.name, quote: req.body.quote})
        .then(result => {
          console.log('Delete result:', result);  // Add this line
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Message deleted!')
        })
        .catch(error => {
          console.error(error)
          res.status(500).json('Error deleting message')
        })
    });

    app.listen(8000, function () {
      console.log('listening on port 8000')
    });
  })
  .catch(error => console.error(error))
