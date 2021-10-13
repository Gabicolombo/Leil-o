const moment = require('moment')

function formataMensagem(username, message, room){
    return{
        username,
        text: message,
        room,
        time: moment().format('h:mm a')
    }
}

module.exports = formataMensagem