const express = require('express')
const usuario = require('../database/user')
const bcryptjs = require('bcryptjs')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('../config/off.json')
const router = express.Router()

router.post('/login', async(req, res) =>{

    const {email, senha} = req.body
    console.log('email: ' + email + ' senha: ' + senha)
    try{

        const usuarioCadastrado = await usuario.find({email}).select('+senha')
        
        if(usuarioCadastrado.length === 0){
            return res.status(400).json({error:' usuário não cadastrado'})
        }
        
        const comparaSenha = bcryptjs.compare(senha, usuarioCadastrado[0].senha)
        
        if(!comparaSenha){
            return res.status(400).json({error: 'Senha inválida'})
        }
        
        const token = jwt.sign({_id:usuarioCadastrado[0].id.toString()}, config.secret)
        
        usuarioCadastrado[0].tokens = usuarioCadastrado[0].tokens.concat({token})
        await usuarioCadastrado[0].save()


        res.status(200).send({usuarioCadastrado, token})

    }catch(err){
        res.send(err.message)
    }
})

router.get('/me', auth, async(req, res)=>{
    try{
        res.send(req.user)
    }catch(e){
        res.send(e)
    }
})

router.post('/saida', auth, async(req, res)=>{
    try{
        
        req.user.tokens = []
        
        await usuario.findByIdAndUpdate(req.user.id,{
            '$set':{
                tokens:[]
            }
        })
    
        res.status(200).send('Volte sempre')
    }catch(e){
        res.status(500).send(e.message)
    }
})


module.exports = router