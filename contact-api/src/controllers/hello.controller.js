const config = require('../config');

const helloController = (req, res) => {
  res.json({ message: config.helloMessage });
};

module.exports = helloController;
