'use strict';

const path = require('path');
const skillModel = require('../models/skill.model');
const { skillIdSchema, skillSchema, refSchema } = require(path.resolve('middleware/validation/schemas'));

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
    try {
        const idVal = await skillIdSchema.validateAsync(req.params);
        let skillDbResult = await skillModel.getSkillBySkillId(idVal.skill_id);
        if(skillDbResult.length > 0) {
            skillDbResult[0].references = await skillModel.getReferenceBySkillId(idVal.skill_id);
            return res.status(200).json(skillDbResult[0]);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/all'
exports.getAllSkills = async (req, res) => {
    try {
        let skillDbResult = await skillModel.getAllSkills();
        if(skillDbResult.length > 0) {
            for (let i = 0; i < skillDbResult.length; i++){
                skillDbResult[i].references  = await skillModel.getReferenceBySkillId(skillDbResult[i].skill_id);
            }
            return res.status(200).json(skillDbResult);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};

// route '/api/v1/aws-training-management-system/skill'
exports.postNewSkill = async (req, res) => {
    try {   
        const skillVal = await skillSchema.validateAsync(req.body);
        const refVal = await refSchema.validateAsync(req.body.references[0]);
        let skillDbResult = await skillModel.postNewSkill(skillVal.skill_name, skillVal.skill_description);
        await skillModel.postNewReference(refVal.ref_link, refVal.ref_category, refVal.length_in_mins, skillDbResult.insertId);
        return res.status(200).json({"added" : "1"});
    }  catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json(error_message)    
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id'
exports.putSkillBySkillId = async (req, res) => {
    try {
        const idVal = await skillIdSchema.validateAsync(req.params);
        const skillVal = await skillSchema.validateAsync(req.body);
        const refVal = await refSchema.validateAsync(req.body.references[0])
        await skillModel.putSkillBySkillId(skillVal.skill_name, skillVal.skill_description, idVal.skill_id);
        let reference = await skillModel.getReferenceBySkillId(idVal.skill_id);
        await skillModel.putReferenceByReferenceId(refVal.ref_link, refVal.ref_category, refVal.length_in_mins, reference[0].reference_id);
        return res.status(200).json({"updated" : "1"});
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json(error_message)
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id'
exports.deleteSkillBySkillId = async (req, res) => {
    try {
        const idVal = await skillIdSchema.validateAsync(req.params);
        await skillModel.deleteSkillBySkillId(idVal.skill_id);
        let reference = await skillModel.getReferenceBySkillId(idVal.skill_id);
        await skillModel.deleteReferenceByReferenceId(reference[0].reference_id);
        return res.status(200).json({"deleted" : "1"});
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json(error_message)
        })
    }
};

// Error handling

function errorHandling(err, errInfo){
    let status_code = 0;
    if (err.isJoi) {
        status_code = 422;
        err.error_message = "Unprocessable Entity."
    } else if (err.code === "ERR_SYSTEM_ERROR") {
        status_code = 503;
        err.error_message = "Cannot connect to database / System error."
    } else if (err.code === "ER_DUP_ENTRY") {
        status_code = 409;
        err.error_message = "Duplicate entry."
    } else {
        status_code = 500;
        err.error_message = "Internal Server Error."
    }

    errInfo(status_code, err.error_message);
}