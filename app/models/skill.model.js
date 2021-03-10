'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');

exports.getSkillBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getSkillBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.getReferenceBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getReferenceBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};
