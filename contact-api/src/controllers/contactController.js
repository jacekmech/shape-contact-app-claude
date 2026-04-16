const contact = require('../domain/contact');
const mailer = require('../infra/mailer');

const postContact = async (req, res) => {
  const errors = contact.validate(req.body);

  if (errors) {
    return res.status(422).json({ success: false, errors });
  }

  try {
    await mailer.sendContactEmail(req.body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

module.exports = { postContact };
