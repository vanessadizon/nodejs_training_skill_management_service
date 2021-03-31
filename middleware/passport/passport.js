'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const userModel = require('../../app/models/user.model')

module.exports = function(passport){
    let opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.jwt.secretKey;
    console.log(opts)
    passport.use(new JwtStrategy(opts, async (jwt_payload, done)=> {
        try {
           const userDBResult = await userModel.getUserByAwsEmail(jwt_payload.email);
           if(!userDBResult)  return done(null, false);
           else  return done(null, userDBResult[0]);
        } catch (err) {
            return done(err, false);
        }
    }));
}

