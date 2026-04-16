const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (data) => {
  const errors = {};
  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const message = (data.message || '').trim();

  if (!name) {
    errors.name = 'Name is required';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Invalid email address';
  }

  if (!message) {
    errors.message = 'Message is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

module.exports = { validate };
