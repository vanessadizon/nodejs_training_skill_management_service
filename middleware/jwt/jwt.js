const jwt = require('jsonwebtoken');
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
//ES6 import JWTR from 'jwt-redis';
var redisClient = redis.createClient(6379, '127.0.0.1');

var jwtr = new JWTR(redisClient);
const ExtractJwt = require('passport-jwt').ExtractJwt;

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

exports.destroyToken = async () => {
    const jti =  ExtractJwt.fromAuthHeaderAsBearerToken();
    await jwtr.destroy(jti);
}