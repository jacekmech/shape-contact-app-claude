const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContact = ({ name, email, message } = {}) => {
  const errors = {};

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) {
    errors.name = 'Name is required.';
  } else if (trimmedName.length > 200) {
    errors.name = 'Name must be 200 characters or fewer.';
  }

  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Email address is invalid.';
  }

  const trimmedMessage = typeof message === 'string' ? message.trim() : '';
  if (!trimmedMessage) {
    errors.message = 'Message is required.';
  } else if (trimmedMessage.length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

module.exports = { validateContact };
