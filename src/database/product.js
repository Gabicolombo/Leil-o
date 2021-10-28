const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nome:{
        type:String,
        required:true
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Usuario'
    },
    localizacao:{
        type: mongoose.Schema.Types.String,
        required:true,
        ref:'Usuario'
    },
    valorInicial:{
        type:Number, // talvez irá mudar
        required:true
    },
    dataInicio:{
        type:String,
        required:true
    },
    dataFinal:{
        type:String,
        required:true
    },
    urlImagem: {
        type: String
    },
    status: {
        type: Number, // 0: Não iniciado 1: Iniciado 2: Finalizado
        default: 0
    } 
})


ProductSchema.pre('save', async function(prox){
    const product = this
    prox()
})

const Product = mongoose.model('Produtos', ProductSchema)
module.exports = Product