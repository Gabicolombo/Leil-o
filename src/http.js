const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { dirname, resolve } = require('path');
const { fileURLToPath } = require('url');


const databaseConnection = require('./database/mongoConnection');

const routerCadastro = require('./routes/cadastro');
const routerLogin = require('./routes/login');

const publicDirectory = resolve(__dirname, '../', 'public');


const app = express();
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, { cors: { origin: '*', methods: '*' } });

app.use(express.static(publicDirectory));

module.exports = { serverHttp, io };

// app.use(cors());
// app.use(express.json());
// app.use(routerCadastro)
// app.use(routerLogin)

// app.get('/chat', (req, res) => {
//     res.send('<h1>Hey Socket.io</h1>');
// });

databaseConnection();


