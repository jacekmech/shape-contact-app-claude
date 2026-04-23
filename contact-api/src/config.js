const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  helloMessage: process.env.HELLO_MESSAGE || 'Hello, World!',
};

module.exports = config;
