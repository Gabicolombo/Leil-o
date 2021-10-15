const express = require('express')
const usuario = require('../database/user')
const produto = require('../database/product')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/cadastroProduto', async(req, res)=>{
    const {nome, imagem} = req.body
    try{
        if(await produto.findOne({nome}) || await produto.findOne({imagem})){
            return res.status(400).json({error: 'Esse usuário já existe'})
        }

        const result = await produto.create(req.body)
        res.status(200).json({message:'Produto cadastrado com sucesso'})
    }catch(e){
        res.status(400).json({error:'Erro no registro'})
    }
})


module.exports = router

