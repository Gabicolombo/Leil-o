const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/leilao')
const bcryptjs = require('bcryptjs')
const { CommandSucceededEvent } = require('mongodb')
//mongoose.Promise = global.Promise

const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    CPF:{
        type: Number,
        unique: true,
        required: true,
        minlength:11,
        validate(value){
            if(value.toString().length != 11){
                throw new Error('CPF inválido!!')
            }
        }
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