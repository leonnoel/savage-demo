// I grab every icon of each type. The thumbDown line is new: originally this file
// never looked for .fa-thumbs-down, so clicking it ran no code at all. That was the
// main reason thumbs down was broken.
var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

// Sends a request and returns the parsed JSON response.
// Throws (with the status and server's error message) if the request failed,
// so the .catch() in each click handler can log it.
//
// I created this helper so all three buttons send requests and handle errors the
// same way, instead of copying the same fetch and response-handling code three times.
// That copy-paste is part of how thumbs down got missed in the first place.
//   action = a label for my logs ("Thumbs up", "Thumbs down", "Delete")
//   method = the HTTP method: PUT to update, DELETE to remove
//   url    = 'messages' is relative, so from the page at / it goes to /messages
//   body   = the data the server needs to find the right message ({id: ...})
function sendRequest(action, method, url, body) {
  console.log(`[${action}] ${method} ${url}`, body)
  // fetch() sends the HTTP request and returns a Promise, a value that isn't ready
  // yet. .then() runs once the server answers.
  return fetch(url, {
    method: method,
    // This header tells Express the body is JSON, so bodyParser.json() fills req.body.
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  .then(response => {
    // Important: fetch only rejects when the request never reaches the server
    // (server down, no network). A 404 or 500 still counts as an "answer", so I
    // have to check response.ok myself. The old code skipped that check and
    // reloaded the page anyway, which wiped the console before I could read errors.
    return response.json()
      .catch(() => null) // response body wasn't JSON
      .then(data => {
        console.log(`[${action}] Response status: ${response.status}`, data)
        // response.ok is true for status codes 200-299. For anything else I throw
        // an Error that includes the status code and the server's {error: ...}
        // message, so the log tells me exactly which request failed and why.
        if (!response.ok) {
          const reason = data && data.error ? data.error : response.statusText
          throw new Error(`${method} ${url} failed with ${response.status}: ${reason}`)
        }
        // On success I hand the server's JSON (the updated message) to the caller.
        return data
      })
  })
}

// All three buttons follow the same pattern:
//   1. Find the message (<li>) the clicked icon belongs to.
//   2. Read its data-id (the message's MongoDB _id), which the server uses to find it.
//   3. Send the request with sendRequest().
//   4. .then() runs on success and updates the page; .catch() runs on any failure.
Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        // `this` is the icon that was clicked. closest('.message') walks up to its <li>.
        // I use class names here instead of childNodes[1]/[3]/[5] like before, because
        // those position numbers break as soon as another <span> is added to the <li>.
        const li = this.closest('.message')
        // I used to send the name + msg text here, but innerText doesn't always match
        // what's stored (double spaces collapse, a missing msg reads as ""), and two
        // messages can have identical text. That caused 404s and votes landing on a
        // different message. dataset.id reads the data-id attribute from index.ejs,
        // which is unique to this message.
        const id = li.dataset.id
        // I only send the id, not the current count. The server uses $inc to add 1
        // to whatever is stored in MongoDB, so the number on the page can't overwrite it.
        sendRequest('Thumbs up', 'PUT', 'messages', {'id': id})
        .then(data => {
          // `data` is the updated document the server sent back with res.json(), so
          // data.thumbUp is the real count from the database. I write it into this
          // message's count span instead of reloading the page, which keeps the
          // console logs visible.
          li.querySelector('.thumbUpCount').innerText = data.thumbUp
        })
        // .catch() catches anything that went wrong above: network failure, the
        // Error thrown for a bad status, or a problem reading the data. I use
        // console.error so it shows up in red and stays in the console, rather than
        // failing silently.
        .catch(err => console.error('[Thumbs up] Error:', err))
      });
});

// Thumbs down is new. It's the same as thumbs up, but it calls the separate
// PUT /messages/thumbDown route and updates the thumbDownCount span.
Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const li = this.closest('.message')
        const id = li.dataset.id
        sendRequest('Thumbs down', 'PUT', 'messages/thumbDown', {'id': id})
        .then(data => {
          li.querySelector('.thumbDownCount').innerText = data.thumbDown
        })
        .catch(err => console.error('[Thumbs down] Error:', err))
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const li = this.closest('.message')
        const id = li.dataset.id
        sendRequest('Delete', 'DELETE', 'messages', {'id': id})
        // I only remove the <li> after the server confirms the delete. If it fails,
        // the message stays on screen and the error is logged.
        .then(() => {
          li.remove()
        })
        .catch(err => console.error('[Delete] Error:', err))
      });
});
