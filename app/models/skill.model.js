'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');

// Model function where it get skill_details using skill_id
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

// Model function where it get references using skill_id
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

// Model function where it delete skill_details using skill_id
exports.deleteSkillDetailBySkillId = (skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/deleteSkillDetailBySkillId.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

// Model function where it delete references using skill_id
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
}

// Model function where it add skill_details using skill_id
exports.addNewSkill = (skillDetails) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addNewSkill.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            skillDetails.skill_name,
            skillDetails.skill_description
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

// Model function where it add references using skill_id
exports.addReferences = (references) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addReferences.sql'), 'utf-8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            references.ref_link,
            references.ref_category,
            references.length_in_mins,
            references.skill_id
        ]).then((result) => {
                resolve(result);
            }).catch((err) => {
                logger.error('query error:', err);
                reject(err);
            });
    });
};

// Model function where it updates skill_details using skill_id
exports.updateSkillDetail = (skillDetails) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/updateSkillDetail.sql'), 'utf-8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            skillDetails.skill_name,
            skillDetails.skill_description,
            skillDetails.skill_id
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

// Model function where it updates references using skill_id
exports.updateReferences = (references) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/updateReferences.sql'), 'utf-8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            references.ref_link,
            references.ref_category,
            references.length_in_mins,
            references.skill_id
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

// Model function where it gets all available skill in the db
exports.getAllSkills = () => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getAllSkills.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.addNewUser = (user_details) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addNewUser.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            user_details.aws_email,
            user_details.password,
            user_details.last_name,
            user_details.first_name,
            user_details.dev
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.user_login = (user) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/userLogin.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            user.user_id,
            user.password
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};