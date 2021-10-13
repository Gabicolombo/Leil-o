const express = require('express')
const usuario = require('../database/user')
const bcryptjs = require('bcryptjs')
const router = express.Router()

router.post('/login', async(req, res) =>{

    const { email, senha } = req.body
    try {
        const usuarioCadastrado = await usuario.find({email}).select('+senha')
        
        if(usuarioCadastrado.length === 0){
            return res.status(400).json({error:' usuário não cadastrado'})
        }
        
        const comparaSenha = await bcryptjs.compare(senha, usuarioCadastrado[0].senha)
      
        if(!comparaSenha){
            return res.status(400).json({error: 'Senha inválida'})
        }
        
        res.status(200).json({message:'bem vinda(o)'})


    }catch(err){
        res.send(err)
    }
})


module.exports = router