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

exports.putSkillBySkillId = (skill_body) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/putSkillBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_body).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.putReferenceBySkillId = (ref_body) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/putReferenceBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, ref_body).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.postSkill = (skill_body) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/postSkill.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_body).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.postReference = (ref_body) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/postReference.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, ref_body).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.deleteSkillBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/deleteSkillBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.deleteReferenceBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/deleteReferenceBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.getSkillAll = () => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getSkillAll.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery).then((result) => {
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
