const moment = require('moment')
const { io } = require('./http');
// const {userJoin, getCurrentUser, userLeave, getRoomUsers, getUsers} = require('./utils/users');
const formatMessage = require('./utils/messages');

const Produto = require('./database/product');

const botName = 'Watson'

class Socket {
  static users = [];
  static messages = [];
  static rooms = [];

  static io;

  constructor(){}

  async init(server) {
    if (Socket.server) return;

    Socket.io = require('socket.io')(server,  { cors: { origin: '*', methods: '*' } });

    Socket.users = [];
    Socket.messages = [];
    Socket.rooms = {};

    Socket.refreshRooms();
    
    Socket.io.on('connection', socket => {
      socket.on('joinRoom', (data, callback) => {
          const { username, room, roomName } = data;
          
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
          callback({
            room: user.room,
            users: this.getRoomUsers(user.room),
            messages: this.getMessagesRoom(user.room),
            currentValue: Socket.rooms[user.room] && Socket.rooms[user.room].currentValue,
            leftTime: Socket.rooms[user.room] && Socket.rooms[user.room].currentTime
          });

          Socket.io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: this.getRoomUsers(user.room)
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
          
          console.log('room', Socket.rooms);

          const room = Socket.rooms[user.room];
          console.log('room', room);
          if (room && room.currentValue < message) {
            Socket.rooms[user.room].currentValue = message;
            // const index = Socket.rooms[user.room]['userValues'].findIndex((_user) => _user.name === user.name)
            // if (index !== -1) Socket.rooms[user.room]['userValues'][index].value = message;
            // const userValues = Socket.rooms[user.room]['userValues'];
            Socket.io.to(user.room).emit('message', formatMessage(user.name, message, user.room));
            Socket.io.to(user.room).emit('currentValue', { currentValue: message, currentTime: room.currentTime })
          }
      });
      
        // Executa quando um cliente se desconecta
      socket.on('disconnect', () => {
          const user = this.userLeave(socket.id);
      
          if (user) {
            Socket.io.to(user.room).emit(
              'message',
              formatMessage(botName, `${user.name} deixou a sala.`)
            );
      
            // Send users and room info
            Socket.io.to(user.room).emit('roomUsers', {
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
    const userInRoom = Socket.users.findIndex((user) => user.name === username && user.room === room);

    if (userInRoom !== -1) {
      Socket.users[userInRoom].id = id;
    } else {
      Socket.users.push(user);
    }

    // const userValue = Socket.rooms[room]['userValues'].findIndex((user) => user.name === username);
    // if (userValue === -1) {
    //   Socket.rooms[room]['userValues'].push({ ...user, value: 0 })
    // } else {
    //   const currentUserValue = Socket.rooms[room]['userValues'][userValue];
    //   Socket.rooms[room]['userValues'][userValue] = { ...currentUserValue, id };
    // }

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

  static async decrementTime(key) {
    console.log('decrementTime');

    await Produto.findByIdAndUpdate(key, { status: 1 })
    const interval = setInterval(async () => {
      Socket.rooms[key].currentTime--;
      if (Socket.rooms[key].currentTime <= 0) {
        Socket.io.to(key).emit('finalTime', true);
        delete Socket.rooms[key];
        await Produto.findByIdAndUpdate(key, { status: 2, finalValue: Socket.rooms[key].currentValue })
        clearInterval(interval);
      }
    }, 3000);
  }

  static async refreshRooms() {
    console.log('refreshRooms')

    // Busca produtos que ainda não iniciaram a contagem do tempo
    const products = await Produto.find({ status: 0 });

    // Atualiza as salas do socket com as informações dos leilões ainda não iniciados
    products && products.forEach((product) => {
      let currentTime = 600;
      if (product.dataInicio && new Date() > product.dataInicio) 
        currentTime = new Date().getTime - product.dataInicio
      
      Socket.rooms[product._id] = { 
        currentValue: product.valorInicial,
        startDate: product.dataInicio,
        currentTime
      }
    });
  }
}

module.exports = { Socket }

// Run when client connects
