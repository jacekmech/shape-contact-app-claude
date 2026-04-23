const express = require('express');
const { getHello } = require('./controllers/helloController');

const app = express();

app.get('/api/hello', getHello);

module.exports = app;
