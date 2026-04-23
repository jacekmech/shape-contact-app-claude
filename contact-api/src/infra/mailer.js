const nodemailer = require('nodemailer');
const config = require('../config');

function buildConsoleTransport() {
  return {
    send({ name, email, message }) {
      console.log('[mailer] contact form submission');
      console.log(`  To:      ${config.contactRecipient}`);
      console.log(`  From:    ${name} <${email}>`);
      console.log(`  Message: ${message}`);
      return Promise.resolve();
    },
  };
}

function buildSmtpTransport() {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: config.smtpUser
      ? { user: config.smtpUser, pass: config.smtpPass }
      : undefined,
  });

  return {
    send({ name, email, message }) {
      return transporter.sendMail({
        from: config.smtpFrom,
        to: config.contactRecipient,
        replyTo: email,
        subject: `Contact form message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
    },
  };
}

const mailer = config.emailTransport === 'smtp'
  ? buildSmtpTransport()
  : buildConsoleTransport();

module.exports = mailer;
