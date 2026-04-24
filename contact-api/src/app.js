const express = require('express');
const helloController = require('./controllers/hello.controller');

const app = express();
const apiRouter = express.Router();

apiRouter.get('/hello', helloController);
app.use('/api', apiRouter);

module.exports = app;
