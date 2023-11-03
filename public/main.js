var thumbUp = document.getElementsByClassName("fa-thumbs-up"); //the value is nodelist (storing a bunch of elements )
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");



Array.from(thumbUp).forEach(function(element) {//array.from  goes thru each elment of array for arguement thumbUp
      element.addEventListener('click', function(){ 
        const name = this.parentNode.parentNode.childNodes[3].innerText // go up to the parent and up to the other parent and then the child (look at index.ejs its referring )

        console.log(this)
        const msg = this.parentNode.parentNode.childNodes[7].innerText
        const thumbUpCount = this.parentNode.parentNode.childNodes[9].innerText;//will take string and convert into a integer
        console.log("thumbUpCount" + thumbUpCount)
        fetch("messages", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            msg: msg,
            thumbUp: parseInt(thumbUpCount),
           
          }),
        })
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((data) => {
            console.log(data);
            window.location.reload(true);
          });
      });
});

Array.from(thumbDown).forEach(function (element) {
  //array.from  goes thru each elment of array for arguement thumbUp
  element.addEventListener("click", function () {
    const name = this.parentNode.parentNode.childNodes[3].innerText; // go up to the parent and up to the other parent and then the child (look at index.ejs its referring )

    console.log(this);
    const msg = this.parentNode.parentNode.childNodes[7].innerText;
    // const thumbUpCount = this.parentNode.parentNode.childNodes[9].innerText;
    const thumbDownCount = this.parentNode.parentNode.childNodes[9].innerText;
    console.log("Thumb Down COUnt" + thumbDownCount);
    fetch("messages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        msg: msg,
        thumbDown: parseInt(thumbDownCount)
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){

        console.log(this.parentNode.parentNode.childNodes);
        const name = this.parentNode.parentNode.childNodes[3].innerText
        console.log("name delete: " + name)
        const msg = this.parentNode.parentNode.childNodes[7].innerText
        
        console.log("msg delete: " + msg)
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
