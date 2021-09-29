const mongoose = require('./mongoConnection')
const bcryptjs = require('bcryptjs')
const { CommandSucceededEvent } = require('mongodb')
//mongoose.Promise = global.Promise

const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    apelido:{
        type:String,
        required:true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    cpf:{
        type: String,
        unique: true,
        required: true,
    },
    endereco:{
        type:String,
        required: true
    },
    senha:{
        type:String,
        required:true,
        select:false
    }
})

UserSchema.pre('save', async function(prox){
    const hash = await bcryptjs.hash(this.senha, 10)
    this.senha = hash
})

const user = mongoose.model('Usuarios', UserSchema)
module.exports = user