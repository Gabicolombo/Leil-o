const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { dirname, resolve } = require('path');
const { fileURLToPath } = require('url');


const databaseConnection = require('./database/mongoConnection');

const publicDirectory = resolve(__dirname, '../', 'public');

const routerProduct = require('./routes/product');
const routerUser = require('./routes/user');


const app = express();
const { Socket } = require('./socket');
const socket = new Socket();
const serverHttp = http.createServer(app);
socket.init(serverHttp);

app.use(express.static(publicDirectory));

app.use(cors());
app.use(express.json());
app.use(routerProduct)
app.use(routerUser)
app.use('/files', express.static(resolve(__dirname, "..", "tmp", "uploads")));

databaseConnection();

module.exports = { serverHttp };

