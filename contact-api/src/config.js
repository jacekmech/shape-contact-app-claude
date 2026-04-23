const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  helloMessage: process.env.HELLO_MESSAGE || 'Hello, World!',
  contactRecipient: process.env.CONTACT_RECIPIENT || '',
  emailTransport: process.env.EMAIL_TRANSPORT || 'console',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || '',
};

module.exports = config;
