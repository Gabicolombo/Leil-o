const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const usuario = require('./src/database/user')
const bcryptjs = require('bcryptjs')
const cors = require('cors')
const { count } = require('console')

const app = express()
const door = 2828

//app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async(req, res) =>{

    const {apelido} = req.body
    const {senha} = req.body
    try{
        const usuarioCadastrado = await usuario.find({apelido}).select('+senha')
        
        if(usuarioCadastrado.length === 0){
            return res.status(400).json({error:' usuário não cadastrado'})
        }
        
        const comparaSenha = await bcryptjs.compare(senha, usuarioCadastrado[0].senha)
        console.log(comparaSenha)
        if(!comparaSenha){
            return res.status(400).json({error: 'Senha inválida'})
        }
        
        res.status(200).send('bem vinda(o)')


    }catch(err){
        res.send(err)
    }
})


app.post('/cadastro', async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    const {cpf} = req.body
    const {apelido} = req.body
    try{
        if(await usuario.findOne({email}) || await usuario.findOne({cpf}) || await usuario.findOne({apelido})){
          return res.status(400).json({error: 'Esse usuário já existe'})
        }
        
        const result = await usuario.create(req.body)
        console.log('result:' + result)
        result.senha = undefined
        res.status(200).send('Usuário cadastrado com sucesso')

    }catch (e){
        res.status(400).json({error:'Erro no registro'})
    }
})

app.listen(door, ()=>{
    console.log(`Conectado a porta ${door}`)
})