const config = {
  message: process.env.HELLO_MESSAGE || 'Hello, World!',
  port: parseInt(process.env.PORT, 10) || 3001,
};

module.exports = config;
