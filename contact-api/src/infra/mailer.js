const nodemailer = require('nodemailer');
const config = require('../config');

const transport = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
});

const sendContactEmail = async ({ name, email, message }) => {
  await transport.sendMail({
    from: config.email.from,
    to: config.email.to,
    subject: `Contact form message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });
};

module.exports = { sendContactEmail };
