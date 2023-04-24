var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down"); //added a new variable for thumbs down to start
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText //'this' is used to access properties and methods of the object or html that 'this' refers to- in this case, we are noting parent(s)/child node relationships in the index.ejs file. In both thumbUp and thumbDown functions, we want to highlight the specific lines of code referring to where the message is displayed, and where the thumbs up and thumbs down icons are, so that we can trigger their functionality based upon user input (i.e. whether they thumb messages up/down)
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText) //parseFloat turns string into number(otherwise this would output NaN = Not a Number)
        fetch('messages/thumbUp', { //important: we needed to indicate file path here specifically! This code then makes a PUT request to the URL 'messages/thumbUp', sending JSON data in the request body. The request includes the name, message, and thumbUp data as a JSON object. The header 'Content-Type' is set to 'application/json' to indicate that the request body is in JSON format.
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json() //response.ok is a property of the response object returned by a fetch() request. It is a boolean value that indicates whether the request was successful or not. If response.ok is true, it means that the status code of the response is in the range 200-299 = successful request. The then() method is used to handle the response, and the code inside the if statement is executed only if the request was successful (i.e., response.ok is true).
        })
        .then(data => {
          console.log(data)
          window.location.reload(true) //this is making the page automatically reload each time a user thumbs any messages up or down.
        })
      });
});


Array.from(thumbDown).forEach(function(element) { //copied code block for thumbUp to apply to thumbDown, with appropriate modifications 
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText //important: refer to index.ejs to make note of parent(s)/child node relationship (also noted above). We know that index count begins at 0, and skipped lines are text nodes created by the whitespace or line breaks in the index code. 
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[9].innerText) 
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages/thumbDown', { //important: we needed to indicate file path here specifically as well! 
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbDown':thumbDown,
        'thumbUp': thumbUp,
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});



Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
