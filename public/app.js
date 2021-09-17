
const form = document.querySelector('form')
const input = document.querySelector('input')

form.addEventListener('submit', (event)=>{
    event.preventDefault()

    fetch('/cadastro').then((response)=>{
        response.json().then((data)=>{
            console.log(data)
        })
    })
})