const express = require('express')
const usuario = require('../database/user')
const bcryptjs = require('bcryptjs')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('../config/off.json')
const router = express.Router()

router.get('/me', auth, async(req, res)=>{
    try{
        res.send(req.user)
    }catch(e){
        res.send(e.message)
    }
})

router.get('/cadastro', async(req, res)=>{
    try{
        const users = await usuario.find({})
        if(!users){
            return res.status(404).json({error:'Sem usuários'})
        }
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/login', async(req, res) =>{

    const {email, senha} = req.body
    
    try{
    
        const usuarioCadastrado = await usuario.credentials(email, senha)
        
        const token = await usuarioCadastrado.generateAuthToken()

        res.status(200).send({usuarioCadastrado, token})

    }catch(err){
        res.status(404).send('Informações incorretas')
    }
})

router.post('/cadastro', async(req, res)=>{
    const {email} = req.body
    const {cpf} = req.body
    const {apelido} = req.body
    try{
        if(await usuario.findOne({email}) || await usuario.findOne({cpf}) || await usuario.findOne({apelido})){
          return res.status(400).send('Email, CPF ou Apelido já registrado')
        }
        
        const result = await usuario.create(req.body)
        
        res.status(200).send('Usuário cadastrado com sucesso')

    }catch (e){ 
        res.status(400).send('Erro ao registrar')
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