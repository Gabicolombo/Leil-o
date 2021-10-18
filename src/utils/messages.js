const moment = require('moment')

function formataMensagem(name, message, room){
    return{
        name,
        text: message,
        room,
        time: moment().format('h:mm a')
    }
}

module.exports = formataMensagem