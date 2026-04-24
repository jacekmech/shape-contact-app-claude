const express = require('express');
const helloController = require('./controllers/hello.controller');
const contactController = require('./controllers/contact.controller');

const app = express();
app.use(express.json());

const apiRouter = express.Router();
apiRouter.get('/hello', helloController);
apiRouter.post('/contact', contactController);
app.use('/api', apiRouter);

module.exports = app;
