const express = require('express')
const Produto = require('../database/product')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = express.Router()
const { Socket } = require('../socket');
const upload = require('../config/multer');

router.post('/products', auth, multer(upload).single('fotoLeilao'), async(req, res)=>{
    if(new Date(req.body.dataInicio+":00") >= new Date(req.body.dataFinal+":00")) {
        return res.status(400).json('Data de término não pode ser inferior a data de início')
    }

    const produto = new Produto({
        ...req.body,
        localizacao: req.user.endereco,
        usuario: req.user._id,
        urlImagem: req.file.key
    });
        
    try {
        await produto.save();
        // const produtos = await Produto.find({usuario:{$ne:req.user._id}})
        const produtos = await Produto.find({})
        // Socket.emitter('evento', produtos)
        return res.status(200).json({ message: 'Produto cadastrado com sucesso' })
    } catch(e) {
        return res.status(400).send(e.message)
    }
})

router.get('/products', auth, async(req, res)=>{
    try{
        const produtos = await Produto.find({usuario:{$ne:req.user._id}})
        if(!produtos){
            return res.send('Esse usuário não tem produto cadastrado')
        }
        console.log(produtos.length);
        return res.status(200).json({ data: produtos })
    } catch(e) {
        return res.send(e.message);
    }
})

router.get('/products/:id', auth, async(req, res)=>{
    
    try {
        const leilao = await Produto.findById(req.params.id);
        if(!leilao || leilao.length === 0){
            return res.send('Esse leilão não está cadastrado')
        }
        return res.status(200).json(leilao)
    } catch(e) {
        return res.send(e.message)
    }
})

module.exports = router
