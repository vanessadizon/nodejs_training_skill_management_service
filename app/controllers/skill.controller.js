'use strict';

const skillModel = require('../models/skill.model');

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
    const { skill_id } = req.params;
    try {
        let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
        if(skillDbResult.length > 0) {
            skillDbResult[0].references  = await skillModel.getReferenceBySkillId(skill_id);
            return res.status(200).json(skillDbResult[0]);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
    // TODO : Need to implement errorHandling function
    // errorHandling(err, (status_code, error_message) => {
    //  return res.status(status_code).json({ "error_message" : error_message })
    // })
    }
};
