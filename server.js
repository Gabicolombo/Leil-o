const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const routerCadastro = require('./src/Routers/cadastro')
const routerLogin = require('./src/Routers/login')
const formataMsg = require('./src/utils/messages')


const app = express()
const door = 2828 || process.env.PORT
const server = http.createServer(app)
const io = socketio(server)

//app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'public'))
//app.engine('html', require('ejs').renderFile)
//app.set('view engine', 'html')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routerCadastro)
app.use(routerLogin)
const nomeBot = 'Watson'

// vai rodar quando o cliente se conecta
io.on('connection', socket=>{

    // para dar boas vindas aos usuários
    socket.emit('message', formataMsg(nomeBot,'Seja Bem Vindx'))

    // avisar os demais que o usuário se conectou
    socket.broadcast.emit('message', formataMsg(nomeBot,'O usuário entrou no chat'))

    // vai rodar quando o cliente se desconectar
    socket.on('disconnect', ()=>{
        io.emit('message', formataMsg(nomeBot, 'O usuário saiu do chat'))
    })

})

app.listen(door, ()=>{
    console.log(`Conectado a porta ${door}`)
})