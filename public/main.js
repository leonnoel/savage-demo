const thumbUp = document.getElementsByClassName("fa-thumbs-up");
const thumbDown = document.getElementsByClassName("fa-thumbs-down");
const trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach((element) => {
  element.onclick = (e) => updateThumb(e, "thumbUp");
});

Array.from(thumbDown).forEach((element) => {
  element.onclick = (e) => updateThumb(e, "thumbDown");
});

function updateThumb(e, thumb) {
  const name = e.target.parentNode.parentNode.childNodes[1].innerText;
  const msg = e.target.parentNode.parentNode.childNodes[3].innerText;
  const thumbValue = parseFloat(
    e.target.parentNode.parentNode.childNodes[5].innerText
  );

  fetch("messages", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      msg: msg,
      [thumb]: thumbValue,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then(() => window.location.reload(true));
}

Array.from(trash).forEach((element) => {
  element.onclick = (e) => {
    const name = e.target.parentNode.parentNode.childNodes[1].innerText;
    const msg = e.target.parentNode.parentNode.childNodes[3].innerText;

    fetch("messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        msg: msg,
      }),
    }).then(() => window.location.reload());
  };
});
