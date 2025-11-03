let thumbUp = document.getElementsByClassName("fa-heart");
let thumbDown = document.getElementsByClassName("fa-arrow-down");
let trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const quote = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'quote': quote,
        'thumbUp': thumbUp
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

Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const quote = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messagesDown', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'quote': quote,
        'thumbUp': thumbUp
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

Array.from(trash).forEach(element => {
  element.addEventListener('click', function () {
    // const name = this.parentNode.parentNode.childNodes[1].innerText.trim();
    // const quote = this.parentNode.parentNode.childNodes[3].innerText.trim();

    const name = this.parentNode.parentNode.children[0].innerText.trim();
    const quote = this.parentNode.parentNode.children[1].innerText.trim();
    console.log({ name, quote });

    fetch('/delete', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quote })
    })
      .then(res => res.ok ? res.json() : Promise.reject('Delete failed'))
      .then(data => {
        console.log(data);
        window.location.reload();
      })
      .catch(err => console.error(err));
  });
});

