const config = require('../config');

const getHello = (req, res) => {
  res.json({ message: config.helloMessage });
};

module.exports = { getHello };
