'use strict';

const skillModel = require('../models/skill.model');
const Joi = require('@hapi/joi');
const skillSchema = Joi.object({
    skill_name: Joi.string().required(),
    skill_description: Joi.string(),
    references: Joi.array().items({
        ref_link: Joi.string().uri(),
        ref_category: Joi.number(),
        length_in_mins: Joi.number()
    })
});
const skillIdSchema = Joi.object({
    skill_id: Joi.number().required()
});

// route '/api/v1/aws-training-management-system/skill'
exports.postSkill = async (req, res) => {
    try {
        await skillSchema.validateAsync(req.body);
    }catch(err){
        return res.status(422).json({err});
    }
    var skill_body = [req.body.skill_name, req.body.skill_description];
    try {
        let skillDbResult = await skillModel.postSkill(skill_body);
        if(skillDbResult.affectedRows > 0) {
            var ref_body = [req.body.references[0].ref_link,req.body.references[0].ref_category,req.body.references[0].length_in_mins,skillDbResult.insertId];
            skillDbResult = await skillModel.postReference(ref_body);
            return res.status(200).json({"added": skillDbResult.affectedRows.toString()});
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        if(err.errno == 1062){
            return res.status(409).json({"error message": "Duplicate entry."});
        }
        else{
            return res.status(503).json({"error message": "Cannot connect to database / System error."});
        }
    }
};

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.deleteSkillBySkillId = async (req, res) => {
    try {
        await skillIdSchema.validateAsync(req.params);
    }catch(err){
        return res.status(422).json({err});
    }
    const { skill_id } = req.params;
    try {
        let skillDbResult = await skillModel.deleteSkillBySkillId(skill_id);
        if(skillDbResult.affectedRows > 0) {
            skillDbResult = await skillModel.deleteReferenceBySkillId(skill_id);
            return res.status(200).json({"deleted": skillDbResult.affectedRows.toString()});
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        return res.status(503).json({"error message": "Cannot connect to database / System error."});
    }
};

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.putSkillBySkillId = async (req, res) => {
    try {
        await skillIdSchema.validateAsync(req.params);
        await skillSchema.validateAsync(req.body);
    }catch(err){
        return res.status(422).json({err});
    }
    const { skill_id } = req.params;
    var skill_body = [req.body.skill_name, req.body.skill_description, skill_id];
    var ref_body = [req.body.references[0].ref_link,req.body.references[0].ref_category,req.body.references[0].length_in_mins, skill_id];
    try {
        let skillDbResult = await skillModel.putSkillBySkillId(skill_body);
        if(skillDbResult.affectedRows > 0) {
            skillDbResult = await skillModel.putReferenceBySkillId(ref_body);
            return res.status(200).json({"updated": skillDbResult.affectedRows.toString()});
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        if(err.errno == 1062){
            return res.status(409).json({"error message": "Duplicate entry."});
        }
        else{
            return res.status(503).json({"error message": "Cannot connect to database / System error."});
        }
    }
};

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
    try {
        await skillIdSchema.validateAsync(req.params);
    }catch(err){
        return res.status(422).json({err});
    }
    try {
        const { skill_id } = req.params;
        let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
        if(skillDbResult.length > 0) {
            skillDbResult[0].references  = await skillModel.getReferenceBySkillId(skill_id);
            return res.status(200).json(skillDbResult[0]);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        return res.status(503).json({"error message": "Cannot connect to database / System error."});
    }
};

// route '/api/v1/aws-training-management-system/skill/all'
exports.getSkillAll = async (req, res) => {
    try {
        let skillDbResult = await skillModel.getSkillAll();
        var skill_no;
        if(skillDbResult.length > 0) {
            for(skill_no = 0; skillDbResult.length > skill_no; skill_no++){
                skillDbResult[skill_no].references = await skillModel.getReferenceBySkillId(skillDbResult[skill_no].skill_id);
            }
            return res.status(200).json(skillDbResult);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        return res.status(503).json({"error message": "Cannot connect to database / System error."});
    }
};