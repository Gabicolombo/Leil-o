const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/leilao')
const bcryptjs = require('bcryptjs')
//mongoose.Promise = global.Promise

const UserSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
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
        required: true
    },
    Endereco:{
        type:String,
        required: true
    },
    senha:{
        type:String,
        required:true,
        select:false
    },
    data:{
        type:Date,
        default:Date.now
    }
})

UserSchema.pre('save', async function(prox){
    const hash = await bcryptjs.hash(this.senha, 10)
    this.senha = hash
})

const user = mongoose.model('User', UserSchema)
module.exports = user