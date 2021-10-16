const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nome:{
        type:String,
        required:true
    },
    localizacao:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Usuario'
    },
    valorInicial:{
        type:String, // talvez irá mudar
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
    imagem:{
        // foto -> ver video
    }
    // data hora inicio, data hora final, foto
})