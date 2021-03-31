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
    // TODO : Need to implement errorHandling function
    // errorHandling(err, (status_code, error_message) => {
    //  return res.status(status_code).json({ "error_message" : error_message })
    // })
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
        const refVal = await refSchema.validateAsync(req.body.references[0])
        let skillDbResult = await skillModel.postNewSkill(skillVal.skill_name, skillVal.skill_description);
        let referenceDbResult = await skillModel.postNewReference(refVal.ref_link, refVal.ref_category, refVal.length_in_mins, skillDbResult.insertId);
        if(referenceDbResult) return res.status(200).json({"added" : "1"});
    }  catch (err) {
        if (err.isJoi) return res.status(422).json(err.message)
        errorHandling(err, (status_code, error_message) => {
            return res.status(100).json(err)    
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id'
exports.putSkillBySkillId = async (req, res) => {
    try {
        const idVal = await skillIdSchema.validateAsync(req.params);
        const skillVal = await skillSchema.validateAsync(req.body);
        const refVal = await skillSchema.validateAsync(req.body.references[0])
        let skillDbResult = await skillModel.putSkillBySkillId(skillVal.skill_name, skillVal.skill_description, idVal.skill_id);
        let reference = await skillModel.getReferenceBySkillId(idVal.skill_id);
        let referenceDbResult = await skillModel.putReferenceByReferenceId(refVal.ref_link, refVal.ref_category, refVal.length_in_mins, reference[0].reference_id);
        if (referenceDbResult) return res.status(200).json({ "updated" : "1"});
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(911).json(err)
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id'
exports.deleteSkillBySkillId = async (req, res) => {
    try {
        const idVal = await skillIdSchema.validateAsync(req.params);
        let skillDbResult = await skillModel.deleteSkillBySkillId(idVal.skill_id);
        let reference = await skillModel.getReferenceBySkillId(idVal.skill_id);
        let referenceDbResult = await skillModel.deleteReferenceByReferenceId(reference[0].reference_id);
        if(referenceDbResult) return res.status(200).json({ "deleted" : "1"});
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};