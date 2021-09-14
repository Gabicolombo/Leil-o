const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const usuario = require('./database/user')

const app = express()
const door = 2828

//const diretorio = path.join(__dirname, './public')
//const html = path_join(__dirname, './public/index.html')



app.use(bodyParser.json())

app.get('/', async(req, res) =>{
    try{
        const valores = await usuario.find({})
        res.send(valores)
    }catch(err){
        res.send(err)
    }
})

app.post('/cadastro', async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    try{
        if(await usuario.findOne({email})){
            return res.send('Esse usuário já existe')
        }
        
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