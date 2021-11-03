const express = require('express');
const http = require('http');
const cors = require('cors');
const { resolve } = require('path');

const databaseConnection = require('./database/mongoConnection');

const routerProduct = require('./routes/product');
const routerUser = require('./routes/user');


const app = express();
const { Socket } = require('./socket');
const socket = new Socket();
const serverHttp = http.createServer(app);
socket.init(serverHttp);

app.use(cors());
app.use(express.json());
app.use(routerProduct)
app.use(routerUser)
app.use('/files', express.static(resolve(__dirname, "..", "tmp", "uploads")));

databaseConnection();

module.exports = { serverHttp };

