const moment = require('moment')
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
        console.log('soc', socket.id);
        const { username, room } = data;
        console.log('data', data);
        
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


        // para dar boas vindas aos usuários
        // setInterval(() => {
        //     socket.emit('message', formataMsg(nomeBot,'Seja Bem Vindx', room))
        // }, 10000);

        console.log('mess', messages);
        const messagesRoom = getMessagesRoom(room);
        console.log('mess', messagesRoom);
        callback(messagesRoom);

        // // avisar os demais que o usuário se conectou
        // socket.broadcast
        //     .to(room)
        //     .emit('message', formataMsg(nomeBot,`O ${username} entrou no chat`))

        // // vai rodar quando o cliente se desconectar
        // socket.on('disconnect', ()=>{
        //     let user = ''
        //     const index = users.findIndex(user => user.id === socket.id)
        //     if(index !== -1){
        //         user = users.splice(index, 1)[0]
        //     }
        //     if(user){
        //         io
        //             .to(user.room)
        //             .emit('message', formataMsg(nomeBot, `O ${user.username} saiu do chat`))
        //     }
        // })

        // // pegar as informacoes do chat
        // socket.on('chatMessage', (msg)=>{
        //     const user = users.find(user => user.id === socket.id)
        //     io.to(user.room).emit('message', formataMsg(user.username, msg))
        // })
    })

    socket.on('message', (data) => {
        console.log('data', data);

        const message = {
            room: data.room,
            username: data.username,
            text: data.message,
            time: moment().format('h:mm a')
        }

        messages.push(message);
        console.log('messages', messages);
        // io.to(data.room).emit('message', message);
        socket.emit('message', message);
        // console.log(message);
        // io.emit('message', message);
    })

    socket.on('joinGame', ({ gameId }) => {
        socket.join(gameId);
        console.log("a player joined the room " + gameId);
        socket.to(gameId).emit('joinGame', "A player joined the game!");
    })

    socket.on('my message', (msg) => {
        io.emit('my broadcast', `server: ${msg}`);
    });
})