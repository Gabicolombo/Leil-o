const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const routerCadastro = require('./src/Routers/cadastro')
const routerLogin = require('./src/Routers/login')
const formataMsg = require('./src/utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./src/utils/users')

//teste
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

app.get('/chat', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
  });

// vai rodar quando o cliente se conecta
io.on('connection', (socket)=>{
    console.log('conectado no socket')
    socket.on('joinRoom', ({nome, sala})=>{

        const user = userJoin(socket.id, nome, sala)
        console.log(user)
        socket.join(user.sala)

        // para dar boas vindas aos usuários
        socket.emit('message', formataMsg(nomeBot,'Seja Bem Vindx'))

        // avisar os demais que o usuário se conectou
        socket.broadcast
        .to(user.sala)
        .emit('message', 
            formataMsg(nomeBot,`O ${user.nome} entrou no chat`))

        // vai rodar quando o cliente se desconectar
        socket.on('disconnect', ()=>{
            const user = userLeave(socket.id)
            console.log('user', user.nome)
            if(user){
                io
                .to(user.room)
                .emit('message', formataMsg(nomeBot, `O ${user.nome} saiu do chat`))
            }
        })

        // pegar as informacoes do chat
        socket.on('chatMessage', (msg)=>{
            const user = getCurrentUser(socket.id)
            io
            .to(user.sala)
            .emit('message', formataMsg(user.nome, msg))
        })
    })

})

app.listen(door, ()=>{
    console.log(`Conectado a porta ${door}`)
})