'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger(
    'system'
);

exports.getSkillBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/getSkillBySkillId.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.getReferenceBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/getReferenceBySkillId.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.addNewSkill = (skill_name, skill_description) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/addNewSkill.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [skill_name, skill_description])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.addReference = ({
    ref_link,
    ref_category,
    length_in_mins,
    skill_id,
}) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/addReference.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            ref_link,
            ref_category,
            length_in_mins,
            skill_id,
        ])
            .then((result) => {
                resolve(result.insertId);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.updateSkillDetails = (skill_name, skill_description, skill_id) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/updateSkillDetails.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [skill_name, skill_description, skill_id])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.deleteSkillBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/deleteSkillBySkillId.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [skill_id])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.deleteReferenceBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/deleteReferenceBySkillId.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [skill_id])
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

exports.getAllSkills = () => {
    let prepareQuery = fs.readFileSync(
        path.resolve('app/sqls/getAllSkills.sql'),
        'utf8'
    );
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};
