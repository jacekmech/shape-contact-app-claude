const mailer = require('../infra/mailer');

function validate({ name, email, message }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!email || !email.trim()) {
    errors.email = 'A valid email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!message || !message.trim()) {
    errors.message = 'Message is required.';
  }

  return errors;
}

async function submitContact({ name, email, message }) {
  const errors = validate({ name, email, message });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  await mailer.send({ name: name.trim(), email: email.trim(), message: message.trim() });

  return { ok: true };
}

module.exports = { submitContact };
