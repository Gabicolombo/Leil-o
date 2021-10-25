const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
     // criar schema de mensagens
})


const Message = mongoose.model('Mensagens', ProductSchema)

module.exports = Message;