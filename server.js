const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection
const url = 'mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true'
const dbName = 'demo'

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) throw error
        db = client.db(dbName)
        console.log(`Connected to "${dbName}."`)
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('messages')
        .find().sort({ thumb: -1 }) // Sort comments by most to least thumbs
        .toArray((err, result) => {
            if (err) return console.log(err)
            res.render('index.ejs', { messages: result })
        })
})

app.post('/messages', (req, res) => {
    console.log(req)
    db.collection('messages').insertOne({
        name: req.body.name,
        msg: req.body.msg,
        thumb: 0
    }, (err, result) => {
        if (err) return console.log(err)
        console.log('Saved to database')
        res.redirect('/')
    })
})

app.put('/messages/thumbUp', (req, res) => {
    db.collection('messages').findOneAndUpdate(
        {
            name: req.body.name,
            msg: req.body.msg
        },
        // { $set: { thumb: req.body.thumb + 1 } },
        { $inc: { thumb: 1 } },
        {
            sort: { _id: -1 },
            upsert: true
        },
        (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        }
    )
})

app.put('/messages/thumbDown', (req, res) => {
    db.collection('messages').findOneAndUpdate(
        {
            name: req.body.name,
            msg: req.body.msg
        },
        // { $set: { thumb: req.body.thumb - 1 } },
        { $inc: { thumb: -1 } },
        {
            sort: { _id: -1 },
            upsert: true
        },
        (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        }
    )
})

app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete(
        {
            name: req.body.name,
            msg: req.body.msg
        },
        (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
        }
    )
})