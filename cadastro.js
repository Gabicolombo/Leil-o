const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const usuario = require('./database/user')

const app = express()
const door = 2828

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


app.use(bodyParser.json())

app.get('/', async(req, res) =>{
    try{
        const valores = await usuario.find({})
        res.send(valores)
    }catch(err){
        res.send(err)
    }
})

app.get('/cadastro', (req, res)=>{
    res.render('index.html')
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