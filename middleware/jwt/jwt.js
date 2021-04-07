const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');
const client = require(path.resolve('middleware/redis/redis'));
const { AuthenticationError } = require('../../app/common/common');

exports.createToken = (email) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ email }, config.jwt.secretKey, { expiresIn: config.jwt.accessTokenExpire}, (err, token) => {
            if (err) {
                logger.error('[JWT]' + err);
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

exports.signRefreshToken = (email) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { email },
            config.jwt.refreshTokenSecret,
            { expiresIn: config.jwt.expire },
            (err, token) => {
                if (err) {
                    logger.error('[JWT]' + err);
                    reject(err);
                } else {
                    client.SET(email, token, 'EX',  24 * 60 * 60, (err, reply) => {
                        if (err) {
                            logger.error('[REDIS]' + err);
                            reject(err);
                            return;
                        }
                        resolve(token);
                    });
                }
            }
        );
    });
};

exports.verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization'])
        return res.status(401).json({ error_message: 'UnAuthorized' });
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return res.status(401).json({ error_message: message });
        }
        req.user = payload;
        next();
    });
};
  
exports.verifyRefreshToken = (refreshToken) => {
        console.log(refreshToken);
        return new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken,
                config.jwt.refreshTokenSecret,
                (err, payload) => {
                    if (err) return reject(err);
                    const email = payload.email;

                    client.GET(email, (err, result) => {
                        if (err) {
                            logger.error('[REDIS]' + err);
                            reject(err);
                            return;
                        }
                        if (refreshToken === result) return resolve(email);
                        reject(new AuthenticationError('UnAuthorized'));
                    });
                }
            );
        });
    };
