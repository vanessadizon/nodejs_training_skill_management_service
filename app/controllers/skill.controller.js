'use strict';

const skillModel = require('../models/skill.model');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

//Validation for Skill Details using Joi
const skillSchema = Joi.object({
    skill_name: Joi.string().required(),
    skill_description: Joi.string(),
    references: Joi.array().items({
        ref_link: Joi.string().required(),
        ref_category: Joi.number().valid(0,1,2),
        length_in_mins: Joi.number()
    })
});

//Error Handling function
function errorHandler(err, cb){
    let status_code;
    if(err.isJoi){
        status_code = 400;
    } else if (err.code === "ER_DUP_ENTRY"){
        status_code = 409;
        err.message = "Duplicate Entry.";
    } else {
        status_code = 503;
        err.message = "Cannot connect to database / System error.";
    }
    cb(status_code, err.message);
}

//Validating Skill_id using Joi
const id = Joi.object({
    skill_id: Joi.number().required()
});

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res)  => {

    checkToken(req, res, () => {});
    try {
        await id.validateAsync(req.params);
        const { skill_id } = req.params;
        let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
        if(skillDbResult.length > 0) {
            skillDbResult[0].references  = await skillModel.getReferenceBySkillId(skill_id);
            return res.status(200).json(skillDbResult[0]);
        } else {
            return res.status(200).json({
                error_message: 'Skill_id does not exist'
            });
        }
    } catch (err) {
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
    }
};

//route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.deleteSkillDetailBySkillId = async (req, res) => {
    checkToken(req, res, () => {});
    try{
        await id.validateAsync(req.params);
        const { skill_id } = req.params;
        let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
        if(skillDbResult.length > 0){
            await skillModel.deleteSkillDetailBySkillId(skill_id);
            await skillModel.deleteReferenceBySkillId(skill_id);
            return res.status(200).json({"deleted":"1"});
        } else {
            return res.status(200).json({"deleted":"0"});
        }
    } catch (err) {
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
    }
};

//route '/api/v1/aws-training-management-system/skill'
exports.addNewSkill = async (req, res) => {

    checkToken(req, res, () => {});
    try{
        await skillSchema.validateAsync(req.body);
        const skillDetails = {
            skill_name: req.body.skill_name,
            skill_description: req.body.skill_description,
           } 
        let skillDbResult = await skillModel.addNewSkill(skillDetails);
        if(skillDbResult.affectedRows > 0) {
            const references = {
                ref_link: req.body.references[0].ref_link,
                ref_category: req.body.references[0].ref_category,
                length_in_mins: req.body.references[0].length_in_mins,
                skill_id: skillDbResult.insertId
            }
            await skillModel.addReferences(references);
            return res.status(200).json({'added':'1'});
        } else {
            return res.status(200).json({'added':'0'});
        }
    } catch (err){
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
    }
};

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.updateSkill = async (req, res) => {
    checkToken(req, res, () => {});
    try {
        await skillSchema.validateAsync(req.body);
        const skillDetails = {
            skill_name: req.body.skill_name,
            skill_description: req.body.skill_description,
            skill_id: req.params.skill_id
           }
        const references = {
            ref_link: req.body.references[0].ref_link,
            ref_category: req.body.references[0].ref_category,
            length_in_mins: req.body.references[0].length_in_mins,
            skill_id: skillDetails.skill_id
        }
        let skillDbResult = await skillModel.getSkillBySkillId(skillDetails.skill_id);
        if(skillDbResult.length > 0) {
            await skillModel.updateSkillDetail(skillDetails);
            await skillModel.updateReferences(references);
            return res.status(200).json({'updated': '1'});
        } else {
            return res.status(200).json({
                error_message: 'Skill_id does not exist'
            });
        }
    } catch (err) {
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
      }
};

// route '/api/v1/aws-training-management-system/skill/all'
exports.getAllSkills = async (req, res) => {
    checkToken(req, res, () => {});
    try{
        let skillDbResult = await skillModel.getAllSkills();
        if ( skillDbResult.length > 0){
            for ( var i = 0; i <= skillDbResult.length-1; i++ ){
                skillDbResult[i].references = await skillModel.getReferenceBySkillId(skillDbResult[i].skill_id);
        } 
            return res.status(200).json(skillDbResult);
        } else {
            return res.status(200).json({});
        }
    } catch (err) {
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
      }
};

exports.addNewUser = async (req, res) => {
    const user_details = {
        aws_email: req.body.aws_email,
        password: req.body.password,
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        dev: req.body.dev
    }
    try{
        let skillDbResult = await skillModel.addNewUser(user_details);
        if(skillDbResult.affectedRows > 0) {
            return res.status(200).json({'added':'1'});
        } else {
            return res.status(200).json({'added':'0'});
        }
    } catch (err){
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
    }
};

exports.user_login = async (req, res) =>{
    const user = {
        user_id: req.params.user_id,
        password: req.params.password
    }
    try{
        let skillDbResult = await skillModel.user_login(user);
        if(skillDbResult.length > 0) {
            const token = jwt.sign(skillDbResult[0].user_id.toString(), process.env.ACCESS_TOKEN_SECRET);
            return res.status(200).json({
                'access':'approved',
                accessToken: token
            });
        } else {
            return res.status(200).json({'access':'denied',
                accessToken: ''
        });
        }
    } catch (err){
        errorHandler(err, (status_code, error_message) => {
            return res.status(status_code).json({
                error_message: error_message
            });
        })
    }
}

function checkToken (req, res, next){
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                return res.status(200).json({error_message: "Invalid token."});
            } else {
                req.token = token;
                next();
            }
        })
    } else {
        return res.status(200).json({error_message: "Need to login first to generate access permission."});
    }
}