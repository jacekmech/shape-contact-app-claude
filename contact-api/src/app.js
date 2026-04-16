const express = require('express');
const helloController = require('./controllers/helloController');
const contactController = require('./controllers/contactController');

const app = express();

app.use(express.json());

app.get('/api/hello', helloController.getHello);
app.post('/api/contact', contactController.postContact);

module.exports = app;
