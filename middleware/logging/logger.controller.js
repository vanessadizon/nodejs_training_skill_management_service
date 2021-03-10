'use strict';
const path = require('path');
const logger = require(path.resolve('middleware/logging/logger')).getLogger('client');

exports.clientDebug = function (req, res) {
    logger.debug('[Client][Debug]' + JSON.stringify(req.body));
    res.status(200).json(req.body);
};

exports.clientInfo = function (req, res) {
    logger.info('[Client][Info]' + JSON.stringify(req.body));
    res.status(200).json(req.body);
};

exports.clientWarn = function (req, res) {
    logger.warn('[Client][Warn]' + JSON.stringify(req.body));
    res.status(200).json(req.body);
};

exports.clientError = function (req, res) {
    logger.error('[Client][Error]' + JSON.stringify(req.body));
    res.status(200).json(req.body);
};

exports.clientFatal = function (req, res) {
    logger.fatal('[Client][Fatal]' + JSON.stringify(req.body));
    res.status(200).json(req.body);
};

exports.clientTrace = function (req, res) {
    logger.trace('[Client][Trace]' + JSON.stringify(req.body));
    res.status(200).json(req.body);
};
