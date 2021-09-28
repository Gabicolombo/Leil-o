const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const usuario = require('./database/user')
const bcryptjs = require('bcryptjs')
const { count } = require('console')

const app = express()
const door = 2828

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async(req, res) =>{

    const {username} = req.body
    const {senha} = req.body
    try{
        const usuarioCadastrado = await usuario.find({username}).select('+senha')
        
        if(usuarioCadastrado.length === 0){
            return res.send(' usuário não cadastrado')
        }
        
        const comparaSenha = await bcryptjs.compare(senha, usuarioCadastrado[0].senha)
        if(!comparaSenha){
            return res.status(400).send('Senha inválida')
        }
        
        res.send('bem vinda(o)')


    }catch(err){
        res.send(err)
    }
})


app.get('/cadastro', (req, res)=>{
    res.render('cadastro.html')
})

app.post('/cadastro', async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    const {CPF} = req.body
    const {username} = req.body
    try{
        if(await usuario.findOne({email}) || await usuario.findOne({CPF}) || await usuario.findOne({username})){
            return res.send('Esse usuário já existe')
        }
        
        
        
        const result = await usuario.create(req.body)
        console.log('result:' + result)
        result.senha = undefined
        res.send('Usuário cadastrado com sucesso')

    }catch (e){
        res.send('Erro no registro')
    }
})

app.listen(door, ()=>{
    console.log(`Conectado a porta ${door}`)
})