const JWT = require('jsonwebtoken');
const path = require('path');
const logger = require('../logging/logger').getLogger('system');
const config = require(path.resolve('middleware/config/config'));

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    JWT.sign({ email: user[0].aws_email }, config.jwt.secretKey, { expiresIn: config.jwt.expire }, (err, token) => {
      if (err) {
        logger.error('jwt error:', err);
        return reject(err);
      }
      resolve(token);
    });
  });
};

const validateToken = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(401).json({ error_message: 'Unauthorized' });
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  JWT.verify(token, config.jwt.secretKey, (err, user) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error_message: 'Unauthorized' });
      } else {
        return res.status(401).json({ error_message: err.message });
      }
    }
    req.user = user;
    next();
  });
};

module.exports = { createToken, validateToken };
