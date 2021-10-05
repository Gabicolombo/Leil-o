const express = require('express')
const usuario = require('../database/user')
const bcryptjs = require('bcryptjs')
const router = express.Router()


router.post('/cadastro', async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    const {cpf} = req.body
    const {apelido} = req.body
    try{
        if(await usuario.findOne({email}) || await usuario.findOne({cpf}) || await usuario.findOne({apelido})){
          return res.status(400).json({error: 'Esse usuário já existe'})
        }
        
        const result = await usuario.create(req.body)
        
        result.senha = undefined
        res.status(200).json({message:'Usuário cadastrado com sucesso'})

    }catch (e){
        res.status(400).json({error:'Erro no registro'})
    }
})

module.exports = router

