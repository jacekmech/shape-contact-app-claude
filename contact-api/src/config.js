const config = {
  helloMessage: process.env.HELLO_MESSAGE || 'Hello, world!',
  port: parseInt(process.env.PORT, 10) || 3001,
};

module.exports = config;
