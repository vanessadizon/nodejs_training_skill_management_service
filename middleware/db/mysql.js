const generic_pool = require('generic-pool'),
    mysql = require('mysql');
path = require('path');
const config = require(path.resolve('middleware/config/config'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');

let db = {};

// define connection
let connection = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let pool = mysql.createPool(connection);
// When connect database, Logging information with thread id.
pool.on('connection', (client) => {
    logger.info('[MYSQL] Connected. [ThreadId]' + client.threadId);
});
// When release connection, Logging informationwith thread id.
pool.on('release', (client) => {
    logger.info('[MYSQL] Disconnected. [ThreadId]:' + client.threadId);
});

db.execute = function (query, params) {
    let sql = mysql.format(query, params);
    logger.debug('[MYSQL][SQL]' + sql);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, client) {
            if (err) {
                logger.error('[MYSQL]' + err);
                reject(err);
            } else {
                client.query(query, params, (err, result) => {
                    client.release();
                    if (err) {
                        logger.error('[MYSQL][SQL]' + err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
};

// When process is exit, mysql close;
// db.process = process.on('exit', function () {
//     pool.drain(function () {
//         pool.destroyAllNow();
//     });
// });

module.exports = db;