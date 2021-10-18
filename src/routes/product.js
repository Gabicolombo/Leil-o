const express = require('express')
const Produto = require('../database/product')
const Usuario = require('../database/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()


const upload = multer({
    limits:{
        fileSize: 10000000 // limite de 1 mega
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg||png)$/)){
            return callback(new Error('Por favor faça o upload do tipo jpg ou png'))
        }
        callback(undefined, true)
    }
})

router.post('/products', auth, upload.single('fotoLeilao'), async(req, res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width:253, height:164}).png().toBuffer()
    
    console.log(req.body)

    if(new Date(req.body.dataInicio+":00") >= new Date(req.body.dataFinal+":00")) {
        return res.status(400).json('Data de término não pode ser inferior a data de início')
    }

    const produto = new Produto({
        ...req.body,
        localizacao: req.user.endereco,
        usuario: req.user._id,
        fotoLeilao: buffer
    })
    
        
    try{
        await produto.save()
        res.status(200).json('Produto cadastrado com sucesso')
    }catch(e){
        res.status(400).send(e.message)
        //json('Erro no registro')
    }
})



router.get('/products', auth, async(req, res)=>{
    
    try{
        
        const produtos = await Produto.find({usuario:{$ne:req.user._id}})
        if(!produtos){
            return res.send('Esse usuário não tem produto cadastrado')
        }
        
        res.set('Content-Type', 'image/png')
        res.status(200).send(produtos[0])

    }catch(e){
        res.send(e.message)
    }
})


module.exports = router

