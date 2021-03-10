'use strict';

const swaggerJsDoc = require("swagger-jsdoc"),
    path = require('path'),
    config = require(path.resolve('middleware/config/config'));

//SWAGGER SETUP
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: config.swagger.version,
            title: config.swagger.title,
            description: config.swagger.description,
            contact: {
                name: config.swagger.contact.name
            },
            servers: [config.swagger.servers]
        }
    },
    // ['.routes/*.js']
    // apis: ["server.js"]
    apis: ["./app/routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;