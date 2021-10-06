const moment = require('moment')

function formataMensagem(usuario, texto){
    return{
        usuario,
        texto,
        horario: moment().format('h:mm a')
    }
}

module.exports = formataMensagem