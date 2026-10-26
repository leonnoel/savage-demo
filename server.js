const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
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

// I added this logger so every request shows up in my terminal as "METHOD /path"
// (for example "PUT /messages/thumbDown"). It sits AFTER express.static, so files like
// styles.css and main.js are already handled by the time a request gets here and
// don't clutter the log. next() passes the request on to the matching route below.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`)
  next()
})

// The vote and delete routes find a message by its _id, which main.js sends as a string
// (from the data-id attribute in index.ejs). MongoDB stores _id as an ObjectId, so the
// string has to be converted first. new ObjectId() throws on a bad string, so I check
// with isValid first and return null, which the routes turn into a 400 (bad request).
function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null
}

// GET / loads every message from MongoDB and hands them to index.ejs to build the page.
app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    // Originally this just did console.log(err) and returned without responding,
    // so the browser sat there loading forever. Every request needs exactly one
    // response, so now I log the real error and send a 500 (server error) back.
    if (err) {
      console.error('MongoDB error loading messages:', err)
      return res.status(500).send('Could not load messages')
    }
    res.render('index.ejs', {messages: result})
  })
})

// POST /messages runs when the form is submitted. Every new message starts with
// thumbUp: 0 and thumbDown: 0. The thumbDown field was always saved here, it just
// was never updated or displayed until I wired up thumbs down.
app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    // Same fix as GET /: respond with a 500 instead of leaving the request hanging.
    if (err) {
      console.error('MongoDB error saving message:', err)
      return res.status(500).send('Could not save message')
    }
    console.log('saved to database')
    res.redirect('/')
  })
})

// Thumbs up: add 1 to thumbUp on the matching message
// PUT is the HTTP method for "update something that already exists". main.js sends
// fetch('messages', {method: 'PUT', ...}) and Express matches it to this route.
// bodyParser.json() (set up above) has already turned the JSON body into req.body.
app.put('/messages', (req, res) => {
  console.log('Thumbs up for id:', req.body.id)
  const _id = toObjectId(req.body.id)
  if (!_id) {
    return res.status(400).json({error: 'Missing or invalid message id'})
  }
  db.collection('messages')
  // findOneAndUpdate takes: 1) a filter to find the message, 2) the change to make,
  // 3) options, 4) a callback that runs when MongoDB is done.
  // I find the message by its unique _id. I used to match name + text, but identical
  // or near-identical messages meant the vote could go to a different message (with
  // a different count, so the number jumped), and a message with no stored msg could
  // never match at all (404).
  .findOneAndUpdate({_id: _id}, {
    // The old code was $set: {thumbUp: req.body.thumbUp + 1}, which trusted the number
    // showing in the browser. If that page was out of date (another tab, another
    // user), it would overwrite newer votes. $inc tells MongoDB "add 1 to whatever is
    // stored right now", so the database does the math and no votes get lost.
    // $inc also treats a missing field as 0, so older messages still work.
    $inc: {
      thumbUp: 1
    }
  }, {
    // I removed sort: {_id: -1}. It picked the newest of several matching messages,
    // but an _id can only ever match one message, so there's nothing to sort.
    // I removed upsert: true. Upsert means "if nothing matches, insert a new document".
    // For a vote that's wrong: a typo or mismatch silently created a junk message
    // and still reported success. Now a mismatch is reported as a 404 instead.
    returnOriginal: false // send back the document AFTER the update
    // (that's the option name in MongoDB driver 3.x, which this project uses;
    // newer drivers call it returnDocument: 'after')
  }, (err, result) => {
    // Status codes tell the browser how it went:
    //   200 = it worked (res.json sends 200 by default)
    //   404 = the request was fine but there was no matching message
    //   500 = something went wrong on the server/database side
    if (err) {
      console.error('MongoDB error during thumbs up:', err)
      return res.status(500).json({error: err.message})
    }
    // result.value is the updated document, or null if the filter matched nothing.
    if (!result.value) {
      console.error('Thumbs up failed: no message matched id', req.body.id)
      return res.status(404).json({error: 'Message not found'})
    }
    console.log('Thumbs up saved. thumbUp is now', result.value.thumbUp)
    // I send the whole updated document back as JSON, e.g.
    // {"_id": "...", "name": "...", "msg": "...", "thumbUp": 3, "thumbDown": 1}
    // so main.js can show the new count without reloading the page.
    res.json(result.value)
  })
})

// Thumbs down: add 1 to thumbDown on the matching message
// This route didn't exist before, which was half of why thumbs down was broken (the
// other half was that main.js never listened for thumbs-down clicks). I gave it its
// own URL so it can't be confused with thumbs up. It works exactly like the thumbs-up
// route above (same _id lookup, $inc, no upsert, same status codes), just on the thumbDown field.
app.put('/messages/thumbDown', (req, res) => {
  console.log('Thumbs down for id:', req.body.id)
  const _id = toObjectId(req.body.id)
  if (!_id) {
    return res.status(400).json({error: 'Missing or invalid message id'})
  }
  db.collection('messages')
  .findOneAndUpdate({_id: _id}, {
    $inc: {
      thumbDown: 1
    }
  }, {
    returnOriginal: false // send back the document AFTER the update
  }, (err, result) => {
    if (err) {
      console.error('MongoDB error during thumbs down:', err)
      return res.status(500).json({error: err.message})
    }
    if (!result.value) {
      console.error('Thumbs down failed: no message matched id', req.body.id)
      return res.status(404).json({error: 'Message not found'})
    }
    console.log('Thumbs down saved. thumbDown is now', result.value.thumbDown)
    res.json(result.value)
  })
})

// DELETE /messages removes a message. It finds the message by _id, the same way the
// vote routes do, so deleting one of two identical messages removes the one clicked.
app.delete('/messages', (req, res) => {
  console.log('Delete requested for id:', req.body.id)
  const _id = toObjectId(req.body.id)
  if (!_id) {
    return res.status(400).json({error: 'Missing or invalid message id'})
  }
  db.collection('messages').findOneAndDelete({_id: _id}, (err, result) => {
    // Before, this used res.send(500, err), which is deprecated in Express 4, and it
    // always said "Message deleted!" even when nothing was deleted. Now I use
    // res.status(500) for database errors and return 404 if no message matched.
    if (err) {
      console.error('MongoDB error during delete:', err)
      return res.status(500).json({error: err.message})
    }
    if (!result.value) {
      console.error('Delete failed: no message matched id', req.body.id)
      return res.status(404).json({error: 'Message not found'})
    }
    console.log('Message deleted')
    res.json({message: 'Message deleted!'})
  })
})
