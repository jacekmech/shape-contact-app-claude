const nodemailer = require('nodemailer');
const fs = require('fs');
const config = require('../config');

const createTransport = () => {
  if (config.emailTransport === 'smtp') {
    return nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
};

const transport = createTransport();

const sendContactEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: config.contactFromEmail,
    to: config.contactToEmail,
    replyTo: email,
    subject: `Contact form submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  const result = await transport.sendMail(mailOptions);

  if (config.emailTransport !== 'smtp') {
    const payload = `[mailer] ${new Date().toISOString()} ${result.message}\n`;
    if (config.emailTransport === 'file' && config.emailLogFile) {
      fs.appendFileSync(config.emailLogFile, payload);
    } else {
      process.stdout.write(payload);
    }
  }
};

module.exports = { sendContactEmail };
