'use strict';
// Load the module dependencies
const path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    config = require(path.resolve('middleware/config/config')),
    logger = require(path.resolve('middleware/logging/logger')),
    swaggerDocs = require(path.resolve('middleware/jsdocs/swagger')),
    swaggerUi = require("swagger-ui-express");
const jwt = require('jsonwebtoken');
var cors = require('cors')

// function securityCheck(req, res, next) {
//     var callerIP = req.connection.remoteAddress;
//     var token = req.headers['x-access-token'];
//     if (req.originalUrl.indexOf('authorize') > 0 || req.originalUrl.indexOf('login') > 0) {
//         next();
//         return;
//     }
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//     jwt.verify(token, config.jwt.secretKey, function (err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//         next();
//     });
// }

// Define the Express configuration method
module.exports = function () {
    // Create a new Express application instance
    const app = express();

    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        logger.getLogger('system').debug('NODE_ENV:' + process.env.NODE_ENV);
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    app.use(cors());
    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Routing log directory
    app.use('/log', express.static(path.resolve('log')));

    // Write access logs
    app.use(logger.connectLogger(logger.getLogger('access')));

    // Point static path to dist
    app.use(express.static(path.join(__dirname, '../dist')));

    // Set the application view engine and 'views' folder
    // app.set('views', './app/views');
    // app.set('view engine', 'ejs');
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Configure the flash messages middleware
    app.use(flash());

    // Configure static file serving
    app.use('/', express.static(path.resolve('dist')));
    app.use('/lib', express.static(path.resolve('./node_modules')));
    require(path.resolve('middleware/router/router'))(app);

    //app.use(securityCheck);
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