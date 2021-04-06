'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const config = require(path.resolve('middleware/config/config'));
const userModel = require('../../app/models/user.model');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.jwt.secretKey;
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const userDBResult = await userModel.getUserByAwsEmail(jwt_payload.email);
                if (!userDBResult.length) return done(null, false);
                else return done(null, userDBResult[0]);
            } catch (err) {
                return done(err, false);
            }
        })
    );

    passport.serializeUser(function (user, done) {
        console.log(user.user_id);
        done(null, user.user_id);
    });

    passport.deserializeUser(async function (id, done) {
        const userDBResult = await userModel.getUserByUserId(id);
        if (userDBResult.length) return done(null, userDBResult[0]);
    });
};

function loggedIn(req, res, next) {
    console.log(Object.keys(req))
    console.log(req.sessionID);
    if (req.user) {
        next();
    } else {
        res.status(400).json('User not loggedIn');
    }
}

module.exports.loggedIn = loggedIn;
