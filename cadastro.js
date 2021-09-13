const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const usuario = require('./database/user')

const app = express()
const door = 2828

app.use(bodyParser.json())

app.get('/', (req, res) =>{
    res.send('ok')
})

app.post('/cadastro', async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    try{
        if(await usuario.findOne({email})){
            return res.send('Esse usuário já existe')
        }
        console.log('aq')
        const user = await usuario.create(req.body)
        console.log('user:' + user)
        user.senha = undefined
        res.send('Usuário cadastrado com sucesso')

    }catch (e){
        res.send('Erro no registro')
    }
    
})

app.listen(door, ()=>{
    console.log(`Conectado a porta ${door}`)
})