const express = require('express');
const { getHello } = require('./controllers/helloController');
const { postContact } = require('./controllers/contactController');

const app = express();

app.use(express.json());

app.get('/api/hello', getHello);
app.post('/api/contact', postContact);

module.exports = app;
