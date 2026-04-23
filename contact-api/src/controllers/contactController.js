const { submitContact } = require('../domain/contactService');

async function postContact(req, res) {
  const { name, email, message } = req.body;

  try {
    const result = await submitContact({ name, email, message });

    if (!result.ok) {
      return res.status(422).json({ success: false, errors: result.errors });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[contactController] send failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
}

module.exports = { postContact };
