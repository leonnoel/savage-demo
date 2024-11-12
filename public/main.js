const thumbUpButtons = document.getElementsByClassName("fa-thumbs-up");
const thumbDownButtons = document.getElementsByClassName("fa-thumbs-down");

Array.from(thumbUpButtons).forEach(function(element) {
  element.addEventListener('click', function() {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText);

    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        msg: msg,
        thumbUp: thumbUp,
        increment: true 
      })
    })
    .then(response => response.ok && response.json())
    .then(data => {
      console.log(data);
      window.location.reload(true);
    });
  });
});

Array.from(thumbDownButtons).forEach(function(element) {
  element.addEventListener('click', function() {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText);

    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        msg: msg,
        thumbUp: thumbUp,
        increment: false
      })
    })
    .then(response => response.ok && response.json())
    .then(data => {
      console.log(data);
      window.location.reload(true);
    });
  });
});
