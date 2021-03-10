'use strict';

require('dotenv').config();

// Set the 'development' environment configuration object
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    uploadDirectory: './upload/',
    mysql: {
        host: '192.168.1.2',
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
        servers: 'http://localhost:' + 3002 + '/'
    },
    jwt: {
        secretKey: 'qawsedrftgyhujikolp;@:',
        expire: 60 * 60 * 24
    },
    port: 3001,
    modelFlag: false

};