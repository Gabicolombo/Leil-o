import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import databaseConnection from './database/mongoConnection';

import routerCadastro from './routes/cadastro';
import routerLogin from './routes/cadastro';

const app = express();
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, { cors: { origin: '*', methods: '*' } });

module.exports = { serverHttp, io };

app.use(cors());
app.use(express.json());
app.use(routerCadastro)
app.use(routerLogin)

app.get('/chat', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

databaseConnection();


