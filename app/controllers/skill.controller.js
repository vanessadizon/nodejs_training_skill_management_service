'use strict';

const skillModel = require('../models/skill.model');
const Joi = require('@hapi/joi');

const skillSchema = Joi.object({
    skill_name: Joi.string().min(3).max(50).required(),
    skill_description: Joi.string().required(),
    references: Joi.array().items(
        Joi.object({
            ref_link: Joi.string().uri(),
            ref_category: Joi.number(),
            length_in_mins: Joi.number(),
        })
    ),
});

const idSchema = Joi.string().pattern(/^[0-9]+$/, 'numbers');

class ValidationError extends Error {
    constructor(message) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);

        this.name = 'ValidationError';
        // Custom debugging information
        this.code = 'VALIDATION_ERROR';
    }
}

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
    const { skill_id } = req.params;
    try {
        const skillIdValidation = idSchema.validate(skill_id);
        if (skillIdValidation.error)
            throw new ValidationError('skill_id must be an integer');
        let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
        if (skillDbResult.length > 0) {
            skillDbResult[0].references = await skillModel.getReferenceBySkillId(
                skill_id
            );
            return res.status(200).json(skillDbResult[0]);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res
                .status(status_code)
                .json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/skill
exports.addNewSkill = async (req, res) => {
    try {
        const skillValidation = skillSchema.validate(req.body);
        if (skillValidation.error)
            throw new ValidationError(skillValidation.error);
        const { skill_name, skill_description, references } = req.body;
        let skillDbResult = await skillModel.addNewSkill(
            skill_name,
            skill_description
        );

        references.forEach((reference) => {
            skillModel.addReference({
                ...reference,
                skill_id: skillDbResult.insertId,
            });
        });
        return res.status(200).json({ added: '1' });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res
                .status(status_code)
                .json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id
exports.updateSkillDetails = async (req, res) => {
    try {
        const { skill_id } = req.params;
        const skillIdValidation = idSchema.validate(skill_id);
        if (skillIdValidation.error)
            throw new ValidationError('skill_id must be an integer');

        const skillValidation = skillSchema.validate(req.body);
        if (skillValidation.error)
            throw new ValidationError(skillValidation.error);
        const { skill_name, skill_description, references } = req.body;
        const skillDbResult = await skillModel.updateSkillDetails(
            skill_name,
            skill_description,
            skill_id
        );
        if (skillDbResult.affectedRows > 0) {
            references.forEach((reference) => {
                skillModel.addReference({ ...reference, skill_id });
            });
            return res.status(200).json({ updated: '1' });
        }
        return res.status(200).json({ updated: '0' });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res
                .status(status_code)
                .json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/skill/:skill_id
exports.deleteSkillBySkillId = async (req, res) => {
    const { skill_id } = req.params;
    try {
        const skillIdValidation = idSchema.validate(skill_id);
        if (skillIdValidation.error)
            throw new ValidationError('skill_id must be an integer');
        const skillDbResult = await skillModel.deleteSkillBySkillId(skill_id);
        if (skillDbResult.affectedRows > 0) {
            await skillModel.deleteReferenceBySkillId(skill_id);
            return res.status(200).json({ deleted: '1' });
        }
        return res.status(200).json({ deleted: '0' });
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res
                .status(status_code)
                .json({ error_message: error_message });
        });
    }
};

// route '/api/v1/aws-training-management-system/skill/all'
exports.getAllSkills = async (req, res) => {
    try {
        let skillDbResult = await skillModel.getAllSkills();

        for (const skill of skillDbResult) {
            skill.references = await skillModel.getReferenceBySkillId(
                skill.skill_id
            );
        }
        return res.status(200).json(skillDbResult);
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res
                .status(status_code)
                .json({ error_message: error_message });
        });
    }
};

const errorHandling = (err, callback) => {
    if (err.code === 'ER_DUP_ENTRY') {
        callback(409, 'Duplicate entry.');
    } else if (err.code === 'VALIDATION_ERROR') {
        callback(400, err.message);
    } else {
        callback(503, 'Cannot connect to database / System error.');
    }
};
