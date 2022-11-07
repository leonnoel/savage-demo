var star = document.getElementsByClassName("fa-star");
var trash = document.getElementsByClassName("fa-trash");



Array.from(star).forEach(function(element) {
      element.addEventListener('click', function(){
        const email = this.parentNode.parentNode.childNodes[3].innerText
       
        const star = (this.classList.contains('fa-regular'))
        console.log(email,star)
        fetch('/contacts', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'email': email,
            'star': star,
           
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

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
