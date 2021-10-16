const express = require('express')
const Produto = require('../database/product')
const Usuario = require('../database/user')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/products', auth, async(req, res)=>{
    console.log('aqui')
    console.log(req.user.endereco)

    const produto = new Produto({
        ...req.body,
        localizacao: req.user.endereco
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
    try{

        const produtos = await Produto.find({endereco, localizacao: req.user.endereco})
        if(!produtos){
            return res.send('Esse usuário não tem produto cadastrado')
        }
        console.log(produtos)
        res.status(200).send(produtos)

    }catch(e){
        res.send(e.message)
    }
})


module.exports = router

