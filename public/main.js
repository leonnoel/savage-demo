let thumbUpIcon = document.getElementsByClassName("fa-thumbs-up");
let thumbDownIcon = document.getElementsByClassName("fa-thumbs-down")
let trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUpIcon).forEach(function (element) {
  element.addEventListener('click', function () {
    const MongoDBid = this.parentNode.parentNode.childNodes[1].dataset.msgId
    console.log(MongoDBid)
    // const name = this.parentNode.parentNode.childNodes[1].innerText
    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    const counter = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('increaseCounterInMongoDB', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // 'name': name,
        // 'msg': msg,
        'lookUpThisIDinMongoDB': MongoDBid,
        'counter': counter
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

Array.from(thumbDownIcon).forEach(function (element) {
  element.addEventListener('click', function () {
    const MongoDBid = this.parentNode.parentNode.childNodes[1].dataset.msgId
    const counter = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('decreaseCounterInMongoDB', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'lookUpThisIDinMongoDB': MongoDBid,
        'counter': counter
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

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const MongoDBid = this.parentNode.parentNode.childNodes[1].dataset.msgId
    fetch('deleteAdocument', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'lookUpThisIDinMongoDB': MongoDBid
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
