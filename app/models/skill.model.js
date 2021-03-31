'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger('system');
const bcrypt = require('bcrypt');

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

exports.getAllAvailableSkills = () => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getAllAvailableSkills.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.addNewSkills = (skillParams) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addNewSkills.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [skillParams.skill_name, skillParams.skill_description]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.addSkillReference = (refParams) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addSkillReference.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [refParams.ref_link, refParams.ref_category, refParams.length_in_mins, refParams.skill_id]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.updateSkills = (skillParams, skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/updateSkills.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [skillParams.skill_name, skillParams.skill_description, skillParams.skill_id]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.updateSkillReference = (refParams) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/updateSkillReference.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [refParams.ref_link, refParams.ref_category, refParams.length_in_mins, refParams.skill_id, refParams.reference_id]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.deleteSkills = (skill_id) => {
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

exports.deleteSkillReference = (skill_id) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/deleteSkillReference.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, skill_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
};

exports.getUsers = () => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/getUsers.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        })
    })
};

exports.addUser = (userParams) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/addUser.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, [
            userParams.aws_email,
            userParams.password,
            userParams.last_name,
            userParams.first_name,
            userParams.dev
        ]).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
}

exports.userLogin = async (userParams) => {
    let prepareQuery = fs.readFileSync(path.resolve('app/sqls/userLogin.sql'), 'utf8');
    return new Promise((resolve, reject) => {
        db.execute(prepareQuery, userParams.user_id).then((result) => {
            resolve(result);
        }).catch((err) => {
            logger.error('query error:', err);
            reject(err);
        });
    });
}
