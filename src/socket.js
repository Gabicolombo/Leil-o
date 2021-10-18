const moment = require('moment')
const { io } = require('./http');
const {userJoin, getCurrentUser, userLeave, getRoomUsers, getUsers} = require('./utils/users');
const formatMessage = require('./utils/messages');

const botName = 'Watson'

const users = [];
const messages = []

function getMessagesRoom(room) {
    const messagesRoom = messages.filter((message) => message.room === room);
    return messagesRoom;
  }

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', (data) => {
      const { name, room } = data;
      console.log('test', name, room);
      const user = userJoin(socket.id, name, room);
  
      socket.join(user.room);
  
      // Welcome current user
      socket.emit('message', formatMessage(botName, `Bem-vindo à sala: ${room}`));
  
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
        users: getRoomUsers(user.room),
        messages: getMessagesRoom(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('message', message => {
      console.log('msg', message);
      const user = getCurrentUser(socket.id);

      messages.push({
        room: user.room,
        username: user.name,
        text: message,
        time: moment().format('h:mm a')
      })
  
      io.to(user.room).emit('message', formatMessage(user.name, message, user.room));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.name} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });