// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash-o");

let birthChart = document.getElementsByClassName("sun","date")



Array.from(birthChart).forEach(function (element) {

  element.addEventListener('submit', function () {
    const date = this.parentNode.parentNode.childNodes[1].innerText
    const sun = this.parentNode.parentNode.childNodes[2].innerText
    const moon = this.parentNode.parentNode.childNodes[3].innerText
    const venus = this.parentNode.parentNode.childNodes[4].innerText

    fetch('birthChart', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'date': date,
        'sun': sun,
        'moon': moon,
        'venus': venus

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
    const date = this.parentNode.parentNode.childNodes[1].innerText
    const sun = this.parentNode.parentNode.childNodes[2].innerText
    const moon = this.parentNode.parentNode.childNodes[3].innerText
    const venus = this.parentNode.parentNode.childNodes[4].innerText
    fetch('birthChart', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': date,
        'sun': sun,
        'moon': moon,
        'venus': venus
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});



//I'm going to get the sun sign by checking the value
// of the date entered by the user



// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// // FETCH FOR THUMBS DOWN GOES HERE TO LOCATE IT----------------------------------------
// Array.from(thumbDown).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         // check the location that this directs to-------------------
//         const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbDown - 2
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });



