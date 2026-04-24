const { validateContact } = require('../domain/contact');
const { sendContactEmail } = require('../infra/mailer');

const contactController = async (req, res) => {
  const { valid, errors } = validateContact(req.body);
  if (!valid) {
    return res.status(422).json({ errors });
  }

  try {
    await sendContactEmail(req.body);
  } catch (err) {
    console.error('[contact] email send failed:', err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }

  return res.status(200).json({ success: true });
};

module.exports = contactController;
