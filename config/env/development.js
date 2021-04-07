'use strict';
// Set the 'development' environment configuration object
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    uploadDirectory: './upload/',
    mysql: {
        host: '192.168.100.111',
        user: process.env.SECRET_DB_USER,
        password: process.env.SECRET_DB_PASSWORD,
        database: 'atms_db',
        port: '3306'
    },
    jwt: {
        secretKey: 'qawsedrftgyhujikolp;@:',
        expire: 60 * 60 * 24,
        refreshTokenSecret: 'a0be693c30e51296b2e6e7edaf4ae18d453d4d62c956a4de146ec4f8f89c7165',
        accessTokenExpire: '15m'
    },
    port: 3001,
    modelFlag: false

};