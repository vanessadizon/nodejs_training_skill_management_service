'use strict';
require('dotenv').config();

const skillModel = require('../models/skill.model');
const Joi = require('@hapi/joi');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

// Schema for joi validations
const userSchema = Joi.object().keys({
    user_id: Joi.number().required()
});
const skillSchema = Joi.object().keys({
    skill_id: Joi.number().required(),
    skill_name: Joi.string(),
    skill_description: Joi.string()
});
const skillBodySchema = Joi.object().keys({
    skill_name: Joi.string().required(),
    skill_description: Joi.string()
});
const refSchema = Joi.object().keys({
    reference_id: Joi.number().required(),
    ref_link: Joi.string(),
    ref_category: Joi.number(),
    length_in_mins: Joi.number(),
    skill_id: Joi.number().required()
});
const refBodySchema = Joi.object().keys({
    ref_link: Joi.string().required(),
    ref_category: Joi.number().required(),
    length_in_mins: Joi.number(),
    skill_id: Joi.number().required()
});

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
    authenticateToken(req, res, () => {});
    const { skill_id } = req.params;
    try {
        Joi.assert(req.params, skillSchema);
        let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
        if(skillDbResult.length > 0) {
            skillDbResult[0].references  = await skillModel.getReferenceBySkillId(skill_id);
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

// route '/api/v1/aws-training-management-system/skill/allSkill'
exports.getAllAvailableSkills = async (req, res) => {
    authenticateToken(req, res, () => {});
    try {
        let results = [];
        let skillDbResult = await skillModel.getAllAvailableSkills();
        if (skillDbResult.length > 0) {
            for (let i = 0; i < skillDbResult.length; i++) {
                skillDbResult[i].references  = await skillModel.getReferenceBySkillId(skillDbResult[i].skill_id);
                results.push(skillDbResult[i]);
            }
            return res.status(200).json(results);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/addNewSkills'
exports.addNewSkills = async (req, res) => {
    authenticateToken(req, res, () => {});
    const skillParams = {
        skill_name: req.body.skill_name,
        skill_description: req.body.skill_description
    }
    try {
        Joi.assert(skillParams, skillBodySchema);
        let skillDbResult = await skillModel.addNewSkills(skillParams);
        if(skillDbResult.affectedRows > 0) {
            for (let i = 0; i < req.body.references.length; i++) {
                const refParams = {
                    ref_link: req.body.references[i].ref_link,
                    ref_category: req.body.references[i].ref_category,
                    length_in_mins: req.body.references[i].length_in_mins,
                    skill_id: skillDbResult.insertId
                }
                Joi.assert(refParams, refBodySchema);
                await skillModel.addSkillReference(refParams);
            }            
            return res.status(200).json({'added': 1});
        } else {
            return res.status(200).json({'added': 0});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/updateSkills/:skill_id/:reference_id'
exports.updateSkills = async (req, res) => {
    authenticateToken(req, res, () => {});
    const skillParams = {
        skill_name: req.body.skill_name,
        skill_description: req.body.skill_description,
        skill_id: req.params.skill_id
    }
    try {
        Joi.assert(skillParams, skillSchema);
        let skillDbResult = await skillModel.updateSkills(skillParams);
        if(skillDbResult.affectedRows > 0) {
            for (let i = 0; i < req.body.references.length; i++) {
                const refParams = {
                    ref_link: req.body.references[i].ref_link,
                    ref_category: req.body.references[i].ref_category,
                    length_in_mins: req.body.references[i].length_in_mins,
                    skill_id: skillParams.skill_id,
                    reference_id: req.params.reference_id
                }
                Joi.assert(refParams, refSchema);
                await skillModel.updateSkillReference(refParams);
            }            
            return res.status(200).json({'updated': 1});
        } else {
            return res.status(200).json({'updated': 0});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/deleteSkills/id/:skill_id'
exports.deleteSkills = async (req, res) => {
    authenticateToken(req, res, () => {});
    const { skill_id } = req.params;
    try {
        Joi.assert(req.params, skillSchema);
        let skillDbResult = await skillModel.deleteSkillReference(skill_id);
        if(skillDbResult.affectedRows > 0) {
            await skillModel.deleteSkills(skill_id);
            return res.status(200).json({'deleted':'1'});
        } else {
            return res.status(200).json({'deleted':'0'});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
};

// route '/api/v1/aws-training-management-system/user'
exports.getUsers = async (req, res) => {
    authenticateToken(req, res, () => {});
    try {
        let skillDbResult = await skillModel.getUsers();
        if (skillDbResult.length > 0) {
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

// route '/api/v1/aws-training-management-system/user/:aws_email/:password/:last_name/:first_name/:dev'
exports.addUser = async (req, res) => {
    authenticateToken(req, res, () => {});
    const hashedPassword = await bcrypt.hash(req.params.password, 10);
    const userParams = {
        aws_email: req.params.skill_name,
        password: hashedPassword,
        last_name: req.params.last_name,
        first_name: req.params.first_name,
        dev: req.params.dev
    };
    try {
        //Joi.assert(skillParams, skillBodySchema);
        let skillDbResult = await skillModel.addUser(userParams);
        if(skillDbResult.affectedRows > 0) {            
            return res.status(200).json({'added': 1});
        } else {
            return res.status(200).json({'added': 0});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
}

// route '/api/v1/aws-training-management-system/user/login/:user_id/:password'
exports.userLogin = async (req, res) => {
    const userParams = {
        user_id: req.params.user_id
    };
    try {
        Joi.assert(userParams, userSchema);
        let skillDbResult = await skillModel.userLogin(userParams);
        if(skillDbResult.length > 0) {
            if (await bcrypt.compare(req.params.password, skillDbResult[0].password)) {
                const accessToken = jwt.sign(skillDbResult[0].user_id.toString(), process.env.ACCESS_TOKEN_SECRET);
                return res.status(200).send({accessToken: accessToken});
            } else {
                return res.status(200).send({})
            }
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandling(err, (status_code, error_message) => {
            return res.status(status_code).json({ "error_message" : error_message })
        })
    }
}

// Authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader !== undefined) {
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(200).json({sucess: "false"});
            req.token = token;
            next();
        })
    } else {
        return res.status(200).json({token: "Not yet authorized to access."});
    }
    
}

// Error handling function
function errorHandling(err, errBody) {
    let status_code;
    if (err.isJoi) {
        status_code = 422;
        err.error_message = "Invalid request."
    } else if (err.code === "ERR_SYSTEM_ERROR") {
        status_code = 503;
        err.error_message = "Cannot connect to database / System error."
    } else if (err.code === "ER_DUP_ENTRY") {
        status_code = 409;
        err.error_message = "Duplicate entry."
    }

    errBody(status_code, err.error_message);
}
