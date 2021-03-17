"use strict";

const path = require("path");
const fs = require("fs");
const db = require(path.resolve("middleware/db/mysql"));
const logger = require(path.resolve("middleware/logging/logger")).getLogger("system");

exports.getSkillBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/getSkillBySkillId.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.getReferenceBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/getReferenceBySkillId.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.getSkillAll = () => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/getSkillAll.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.deleteSkillBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/deleteSkillBySkillId.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.deleteReferenceBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/deleteReferenceBySkillId.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.addSkill = (skill) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/addSkill.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [skill.skill_name, skill.skill_description])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.addReference = (reference) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/addReference.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [reference.ref_link, reference.ref_category, reference.length_in_mins, reference.skill_id])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.updateSkill = (skill) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/updateSkill.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [skill.skill_name, skill.skill_description, skill.skill_id])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};

exports.updateReference = (reference) => {
  let prepareQuery = fs.readFileSync(path.resolve("app/sqls/updateReference.sql"), "utf8");
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [reference.ref_link, reference.ref_category, reference.length_in_mins, reference.skill_id])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error("query error:", err);
        reject(err);
      });
  });
};
