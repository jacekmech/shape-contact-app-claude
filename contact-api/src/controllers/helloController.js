const config = require('../config');

const getHello = (req, res) => {
  res.json({ message: config.message });
};

module.exports = { getHello };
