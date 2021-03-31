'use strict';
// Set the 'development' environment configuration object
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    uploadDirectory: './upload/',
    mysql: {
        host: process.env.HOST,
        user: process.env.SECRET_DB_USER,
        password: process.env.SECRET_DB_PASSWORD,
        database: 'atms_db',
        port: '3306'
    },
    jwt: {
        secretKey: 'qawsedrftgyhujikolp;@:',
        expire: 60 * 60 * 24
    },
    port: 3001,
    modelFlag: false

};