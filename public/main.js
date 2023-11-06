let thumbUp = document.getElementsByClassName('fa-thumbs-up')
let thumbDown = document.getElementsByClassName('fa-thumbs-down')
let trash = document.getElementsByClassName('fa-trash')

Array.from(thumbUp).forEach(function (element) {
    element.addEventListener('click', function () {
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const thumb = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages/thumbUp', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, msg })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    })
})

Array.from(thumbDown).forEach(function (element) {
    element.addEventListener('click', function () {
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const thumb = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages/thumbDown', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, msg })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    })
})

Array.from(trash).forEach(function (element) {
    element.addEventListener('click', function () {
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, msg })
        })
            .then(function (response) {
                window.location.reload()
            })
    })
})