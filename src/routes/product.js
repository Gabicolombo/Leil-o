const express = require('express')
const Produto = require('../database/product')
const Usuario = require('../database/user')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/products', auth, async(req, res)=>{
    console.log('aqui')
    console.log(req.user.endereco)
    console.log(req.user._id)

    const produto = new Produto({
        ...req.body,
        localizacao: req.user.endereco,
        usuario: req.user._id
    })

    try{
       
        await produto.save()
        res.status(200).json({message:'Produto cadastrado com sucesso'})
    }catch(e){
        res.status(400).send(e.message).json({error:'Erro no registro'})
    }
})

router.get('/products', auth, async(req, res)=>{
    const endereco = req.user.endereco
    const usuarioId = req.user._id
    try{

        const produtos = await Produto.find({usuarioId, usuario: req.user._id})
        if(!produtos){
            return res.send('Esse usuário não tem produto cadastrado')
        }
        
        res.status(200).send(produtos)

    }catch(e){
        res.send(e.message)
    }
})


module.exports = router

