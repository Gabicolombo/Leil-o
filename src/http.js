const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const databaseConnection = require('./database/mongoConnection');

const routerProduct = require('./routes/product');
const routerUser = require('./routes/user');

const app = express();
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, { cors: { origin: '*', methods: '*' } });


app.use(cors());
app.use(express.json());
app.use(routerProduct)
app.use(routerUser)


app.get('/chat', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

databaseConnection();

module.exports = { serverHttp, io };

