const { io } = require('./http');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const formataMsg = require('./utils/messages');

const nomeBot = 'Watson'

const users = [];
const messages = []

function getMessagesRoom(room) {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
  }

io.on('connection', (socket)=>{
    console.log('Conectado no socket')
    socket.on('joinRoom', (data, callback)=>{
        const { username, room } = data;
        
        socket.join(room)
        
        // verifica se o usuário já esta dentro da sala, se sim só atualiza o id dele, se nao, coloque ele na sala
        const userInRoom = users.find(
            (user) => user.username == username && user.room === room
        );
        if (userInRoom) {
            userInRoom.id = socket.id;
        } else {
            users.push({
                id: socket.id,
                username,
                room
            });
        }

        const messagesRoom = getMessagesRoom(room);
        callback(messagesRoom);

        // para dar boas vindas aos usuários
        socket.emit('message', formataMsg(nomeBot,'Seja Bem Vindx'))

        // avisar os demais que o usuário se conectou
        socket.broadcast
            .to(user.room)
            .emit('message', formataMsg(nomeBot,`O ${user.username} entrou no chat`))

        // vai rodar quando o cliente se desconectar
        socket.on('disconnect', ()=>{
            let user = ''
            const index = users.findIndex(user => user.id === id)
            if(index !== -1){
                user = users.splice(index, 1)[0]
            }
            if(user){
                io
                    .to(user.room)
                    .emit('message', formataMsg(nomeBot, `O ${user.username} saiu do chat`))
            }
        })

        // pegar as informacoes do chat
        socket.on('chatMessage', (msg)=>{
            const user = users.find(user => user.id === socket.id)
            io.to(user.room).emit('message', formataMsg(user.username, msg))
        })
  })

    socket.on('my message', (msg) => {
        io.emit('my broadcast', `server: ${msg}`);
    });
})