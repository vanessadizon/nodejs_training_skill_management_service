"use strict";

const skillModel = require("../models/skill.model");
const skillDetailsSchema = require("../../middleware/joi/validation.schema");
const helpers = require("../helpers/helpers");

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
  const { skill_id } = req.params;
  try {
    let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
    if (skillDbResult.length > 0) {
      skillDbResult[0].references = await skillModel.getReferenceBySkillId(skill_id);
      return res.status(200).json(skillDbResult[0]);
    } else {
      return res.status(200).json({});
    }
  } catch (err) {
    helpers.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/skill/all'
exports.getSkillAll = async (req, res) => {
  try {
    let skillDbResult = await skillModel.getSkillAll();
    if (skillDbResult.length > 0) {
      for (const skill of skillDbResult) {
        skill.references = await skillModel.getReferenceBySkillId(skill.skill_id);
      }
      return res.status(200).json(skillDbResult);
    } else {
      return res.status(200).json({});
    }
  } catch (err) {
    helpers.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id'
exports.deleteSkillBySkillId = async (req, res) => {
  const { skill_id } = req.params;
  try {
    let skillDbResult = await skillModel.deleteSkillBySkillId(skill_id);

    if (skillDbResult.affectedRows > 0) {
      await skillModel.deleteReferenceBySkillId(skill_id);
      return res.status(200).json({ deleted: "1" });
    } else {
      return res.status(200).json({ deleted: "0" });
    }
  } catch (err) {
    helpers.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/skill'
exports.addSkill = async (req, res) => {
  try {
    await skillDetailsSchema.validateAsync(req.body);
    const skill = {
      skill_name: req.body.skill_name,
      skill_description: req.body.skill_description,
    };
    let skillDbResult = await skillModel.addSkill(skill);

    if (skillDbResult.affectedRows > 0) {
      helpers.addReferences(req.body.references, skillDbResult.insertId);
      return res.status(200).json({ added: "1" });
    } else {
      return res.status(200).json({ added: "0" });
    }
  } catch (err) {
    helpers.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id'
exports.updateSkill = async (req, res) => {
  try {
    await skillDetailsSchema.validateAsync(req.body);

    const skill = {
      skill_id: req.params.skill_id,
      skill_name: req.body.skill_name,
      skill_description: req.body.skill_description,
    };

    let skillDbResult = await skillModel.updateSkill(skill);
    if (skillDbResult.affectedRows > 0) {
      await skillModel.deleteReferenceBySkillId(skill.skill_id);
      helpers.addReferences(req.body.references, skill.skill_id);
      return res.status(200).json({ updated: "1" });
    } else {
      return res.status(200).json({ updated: "0" });
    }
  } catch (err) {
    helpers.errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};
