const config = {
  helloMessage: process.env.HELLO_MESSAGE || 'Hello, world!',
  port: parseInt(process.env.PORT, 10) || 3001,
  emailTransport: process.env.EMAIL_TRANSPORT || 'console',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || '',
  contactToEmail: process.env.CONTACT_TO_EMAIL || '',
  emailLogFile: process.env.EMAIL_LOG_FILE || '',
};

module.exports = config;
