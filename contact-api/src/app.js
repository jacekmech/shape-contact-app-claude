const express = require('express');
const helloController = require('./controllers/helloController');

const app = express();

app.use(express.json());

app.get('/api/hello', helloController.getHello);

module.exports = app;
