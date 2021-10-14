const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

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
        trim:true,
        select:false,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

UserSchema.pre('save', async function(prox){
    const hash = await bcryptjs.hash(this.senha, 8)
    this.senha = hash

    prox()
})



const User = mongoose.model('Usuarios', UserSchema)
module.exports = User