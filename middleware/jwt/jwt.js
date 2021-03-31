const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');

exports.createToken = (email) => {
    return new Promise((resolve, reject) => {
        jwt.sign({email}, config.jwt.secretKey,{ expiresIn: config.jwt.expire }, (err, token) => {
            if (err) {
                logger.error('[JWT]' + err);
                reject(err);
            } else {
                resolve(token);
            }    
        })
    });
}