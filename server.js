const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const routerCadastro = require('./src/Routers/cadastro')
const routerLogin = require('./src/Routers/login')


const app = express()
const door = 2828

//app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'public'))
//app.engine('html', require('ejs').renderFile)
//app.set('view engine', 'html')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routerCadastro)
app.use(routerLogin)







app.listen(door, ()=>{
    console.log(`Conectado a porta ${door}`)
})