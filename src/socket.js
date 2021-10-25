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
          const { name, room, roomName } = data;
          console.log('test', name, room);
          const user = this.userJoin(socket.id, name, room);
      
          socket.join(user.room);
      
          // Welcome current user
          socket.emit('message', formatMessage(botName, `Bem-vindo à sala: ${roomName}`));
      
          // Broadcast when a user connects
          socket.broadcast
            .to(user.room)
            .emit(
              'message',
              formatMessage(botName, `${user.name} entrou na sala`)
            );
      
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: this.getRoomUsers(user.room),
            messages: this.getMessagesRoom(user.room)
          });
      });
      
        // Listen for chatMessage
      socket.on('message', message => {
          console.log('users', Socket.users);
          const user = this.getCurrentUser(socket.id);
    
          Socket.messages.push({
            room: user.room,
            username: user.name,
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
              formatMessage(botName, `${user.name} has left the chat`)
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

      socket.on('disconnect', (data) => {
        // Socket.userLeave(data.id);
      });
    });
  }

  userJoin(id, name, room) {
    const user = { id, name, room };
    // verifica se usuario já está na room
    const userInRoom = Socket.users.find((user) => user.name == name && user.room === room);
    if (userInRoom) userInRoom.id = id;
    Socket.users.push(user);
    return user;
  }

  // get current user
  getCurrentUser(id){
    return Socket.users.find(user => user.id === id)
  }

// User leaves chat
  userLeave(id){
    const index = Socket.users.findIndex(user => user.id === id)

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
