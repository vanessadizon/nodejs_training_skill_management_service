'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const bcrypt = require('bcryptjs');
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');
const { EntityNotFoundError } = require('../common/common');

exports.addNewUser = (user) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addNewUser.sql'), 'utf8');
    const newUser = user;

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                db.execute(prepareQuery, [
                    newUser.aws_email,
                    newUser.password,
                    newUser.last_name,
                    newUser.first_name,
                    newUser.dev,
                ])
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        logger.error('query error:', err);
                        reject(err);
                    });
            });
        });
    });
};

exports.getUserByUserId = (userId) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getUserByUserId.sql'), 'utf8');

    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [userId])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.getUserByAwsEmail = (awsEmail) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getUserByAwsEmail.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [awsEmail])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.updateUser = (user, userId) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/updateUser.sql'), 'utf8');
    return new Promise(async (resolve, reject) => {
        const userDbResult = await this.getUserByUserId(userId);
        if (userDbResult.length <= 0) {
            reject(new EntityNotFoundError(`User with user_id: ${userId} does not exist`));
        }
        const newUser = userDbResult[0];
        if (user.password) newUser.password = user.password;
        if (user.last_name) newUser.last_name = user.last_name;
        if (user.first_name) newUser.first_name = user.first_name;
        if (user.aws_email) newUser.aws_email = user.aws_email;
        if (user.dev) newUser.dev = user.dev;
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                db.execute(prepareQuery, [
                    newUser.aws_email,
                    newUser.password,
                    newUser.last_name,
                    newUser.first_name,
                    newUser.dev,
                    newUser.user_id,
                ])
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        logger.error('query error:', err);
                        reject(err);
                    });
            });
        });
    });
};


exports.deleteUserByUserId = (userId) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/deleteUserByUserId.sql'), 'utf8');
    return new Promise(async (resolve, reject) => {
        db.execute(prepareQuery, [userId])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.getAllUsers = () => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getAllUsers.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};
