'use strict';
const path = require('path');
const loggerController = require(path.resolve('middleware/logging/logger.controller'));

module.exports = function (app) {
    app.route('/api/v1/log/client/debug')
        .post(loggerController.clientDebug);
    app.route('/api/v1/log/client/info')
        .post(loggerController.clientInfo);
    app.route('/api/v1/log/client/warn')
        .post(loggerController.clientWarn);
    app.route('/api/v1/log/client/error')
        .post(loggerController.clientError);
    app.route('/api/v1/log/client/fatal')
        .post(loggerController.clientFatal);
    app.route('/api/v1/log/client/trace')
        .post(loggerController.clientTrace);
};

