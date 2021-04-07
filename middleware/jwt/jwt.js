const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');
const client = require(path.resolve('middleware/redis/redis'));
const { AuthenticationError } = require('../../app/common/common')

exports.createToken = (email) => {
    return new Promise((resolve, reject) => {
        jwt.sign({email}, config.jwt.secretKey,{ expiresIn: '15s' }, (err, token) => {
            if (err) {
                logger.error('[JWT]' + err);
                reject(err);
            } else {
                resolve(token);
            }    
        })
    });
}

exports.signRefreshToken = (email) => {
    return new Promise((resolve, reject) => {
        jwt.sign({email}, "a0be693c30e51296b2e6e7edaf4ae18d453d4d62c956a4de146ec4f8f89c7165",{ expiresIn: '30d' }, (err, token) => {
            if (err) {
                logger.error('[JWT]' + err);
                reject(err);
            } else {
                client.SET(email, token, 'EX', 30 * 24 * 60 * 60,  (err, reply) => {
                    if (err) { 
                        logger.error('[REDIS]' + err);
                        reject(err);
                        return
                    }
                    resolve(token);
                })
            }    
        })
    });
}

exports.verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
       jwt.verify(refreshToken, "a0be693c30e51296b2e6e7edaf4ae18d453d4d62c956a4de146ec4f8f89c7165", (err, payload) => {
           if(err) return reject(err);
           const email = payload.email;

           client.GET(email, (err, result) => {
                if (err) { 
                    logger.error('[REDIS]' + err);
                    reject(err);
                    return
                }
                if (refreshToken === result) return resolve(email);
                reject(new AuthenticationError("UnAuthorized"));
           })
         
       } )
    });
}