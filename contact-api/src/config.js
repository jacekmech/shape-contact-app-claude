const config = {
  message: process.env.HELLO_MESSAGE || 'Hello, World!',
  port: parseInt(process.env.PORT, 10) || 3001,
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT, 10) || 1025,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  email: {
    from: process.env.EMAIL_FROM || 'contact@localhost',
    to: process.env.EMAIL_TO || 'owner@localhost',
  },
};

module.exports = config;
