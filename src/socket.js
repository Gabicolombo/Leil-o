const moment = require('moment')
const { io } = require('./http');
// const {userJoin, getCurrentUser, userLeave, getRoomUsers, getUsers} = require('./utils/users');
const formatMessage = require('./utils/messages');

const botName = 'Watson'

class Socket {
  constructor(){}

  init(server) {
    if (Socket.server) return;

    const io = require('socket.io')(server,  { cors: { origin: '*', methods: '*' } });

    Socket.users = [];
    Socket.messages = []
    
    io.on('connection', socket => {
      socket.on('joinRoom', (data) => {
          const { username, room, roomName } = data;
          console.log('test', username, room);
          
          // Usuario entra em uma sala
          socket.join(room);
          
          // Registros do usuario e da sala a qual ele entrou
          const user = this.addUserToRoom(socket.id, username, room);
          
          // Mensagem de boas vindas ao usuário que entrou na sala
          socket.emit('message', formatMessage(botName, `Bem-vindo à sala: ${roomName}.`));
      
          // Broadcast quando um usuário se conecta a sala
          socket.broadcast
            .to(user.room)
            .emit(
              'message',
              formatMessage(botName, `${user.name} entrou na sala.`)
            );
      
          // Envia informação de usuário e mensagens já existentes na sala
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: this.getRoomUsers(user.room),
            messages: this.getMessagesRoom(user.room)
          });
      });
      
        // Listen for chatMessage
      socket.on('message', message => {
          const user = this.getCurrentUser(socket.id);
    
          Socket.messages.push({
            room: user.room,
            name: user.name,
            text: message,
            time: moment().format('h:mm a')
          })
      
          io.to(user.room).emit('message', formatMessage(user.name, message, user.room));
      });
      
        // Runs when client disconnects
      socket.on('disconnect', () => {
          const user = this.userLeave(socket.id);
      
          if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage(botName, `${user.name} deixou a sala.`)
            );
      
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: this.getRoomUsers(user.room)
            });
          }
      });
    
      socket.on('broadcast', (produtos) => {
        socket.broadcast.emit('produtos', produtos)
      })
    });
  }

  addUserToRoom(id, username, room) {
    const user = { socketId: id, name: username, room };

    // verifica se usuario já está na room
    const userInRoom = Socket.users.find((user) => user.name === username && user.room === room);
    
    if (userInRoom) {
      userInRoom.id = id;
    } else {
      Socket.users.push(user);
    }

    return user;
  }

  // get current user
  getCurrentUser(id){
    return Socket.users.find(user => user.socketId === id)
  }

// User leaves chat
  userLeave(id){
    const index = Socket.users.findIndex(user => user.socketId === id)

    if(index !== -1){
      return Socket.users.splice(index, 1)[0]
    }
  }

  // pegar todos os usuários que estão na sala
  getRoomUsers(room){
    return Socket.users.filter(user => user.room === room)
  }

  getUsers() {
    return Socket.users;
  }

  getMessagesRoom(room) {
    const messagesRoom = Socket.messages.filter((message) => message.room === room);
    return messagesRoom;
  }

  static emitter(event, produtos) {
    console.log('teste', Socket.users)
  }
}

module.exports = { Socket }

// Run when client connects
