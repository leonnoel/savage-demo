// Description:must have clear all button, must have clear completede,
// able to click on the todos and cross of then clear completed to delete
// crosed off. AShow in dom running totals of todo.
// When cliclk on element to complete add a class. Class = in li not ul


var myNodelist = document.getElementsByTagName("li");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}



const ul = document.querySelector('.list')
const input = document.querySelector('#input')
document.querySelector('#addItem').addEventListener('click', addToList)
document.querySelector('#clearItems').addEventListener('click', clearSelectedItems)
document.querySelector('#clearAll').addEventListener('click', clearAll)
let count = document.querySelector('#itemCount')
//Create a function that crosses selesced items out
ul.addEventListener("click", function(e) {
  if (e.target.matches("li.item")) {
    e.target.className = "crossItem"; // new class name here
    console.log(e.target)

    let c = parseInt(count.innerText)
    c -= 1
    count.innerText = c
    }
})

//Create

function addToList(e){
  e.preventDefault()
  const li = document.createElement('li')
  li.className = "item"
  li.innerText = input.value
  ul.appendChild(li)

  let c = parseInt(count.innerText)
  c += 1
  count.innerText = c

  // document.getElementsByTagName('li').addEventListener('click', removeFromList)
}
// function removeFromList(ev) {
//  // e.preventDefault()
//   console.log(ev.target)
// }
// document.querySelectorAll('li.item') for each (element => element.remove())
// Create a function that when you click the button "clear" the crossed out items are deleted from the list.
function clearSelectedItems() {
    //e.preventDefault()
//
//
let deleteItem = ul.querySelectorAll('.crossItem')
let lli = document.getElementsByClassName('.hiddenItem')
deleteItem.forEach(lli => {
  ul.removeChild(lli)

})
// ul.addChild.(hideItem)
    //
    // let crossedItem = document.getElementsByClassName('crossItem')
    // crossedItem.style.backgroundColor = "purple"
}

function clearAll(){
  let deleteItem = ul.querySelectorAll('li')
  deleteItem.forEach(li => {
    ul.removeChild(li)
  })

count.innerText = '0'
}
