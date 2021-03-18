'use strict';
// Load the module dependencies
const path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    config = require(path.resolve('middleware/config/config')),
    logger = require(path.resolve('middleware/logging/logger')),
    swaggerDocs = require(path.resolve('middleware/jsdocs/swagger')),
    swaggerUi = require('swagger-ui-express');

// Define the Express configuration method
module.exports = function () {
    // Create a new Express application instance
    const app = express();

    app.use(express.json());

    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        logger.getLogger('system').debug('NODE_ENV:' + process.env.NODE_ENV);
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Routing log directory
    app.use('/log', express.static(path.resolve('log')));

    // Write access logs
    app.use(logger.connectLogger(logger.getLogger('access')));

    // Configure swagger api documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Configure static file serving
    app.use('/lib', express.static(path.resolve('./node_modules')));
    require(path.resolve('middleware/router/router'))(app);

    // Configure the route
    require(path.resolve('config/router'))(app);

    // Error handle.
    app.use((err, req, res, next) => {
        if (err) {
            logger.getLogger('system').error(err);
        }
        next(err);
    });

    // Return the Express application instance
    return app;
};
