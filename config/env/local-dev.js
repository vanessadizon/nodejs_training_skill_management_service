'use strict';

require('dotenv').config();

// Set the 'local-dev' environment configuration object
module.exports = {
    mysql: {
        host: 'localhost',
        user: process.env.SECRET_DB_USER,
        password: process.env.SECRET_DB_PASSWORD,
        database: 'atms_db',
        port: '3306'
    },
    swagger: {
        version: '1.0.0',
        title: 'Skill Management',
        description: 'Skill Management',
        contact: {
            name: 'vanessa.dizon@awsys-i.com'
        },
        servers: 'http://localhost:' + 3001 + '/'
    },
    jwt: {
        secretKey: 'qawsedrftgyhujikolp;@:',
        expire: 60 * 60 * 24,
        refreshTokenSecret: 'a0be693c30e51296b2e6e7edaf4ae18d453d4d62c956a4de146ec4f8f89c7165',
        accessTokenExpire: '15m'
    },
    port: 3001
};