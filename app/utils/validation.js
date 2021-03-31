const Joi = require('@hapi/joi');

exports.skillSchema = Joi.object({
    skill_name: Joi.string().max(255).required(),
    skill_description: Joi.string().required(),
    references: Joi.array().items(
        Joi.object({
            ref_link: Joi.string().uri(),
            ref_category: Joi.number(),
            length_in_mins: Joi.number(),
        })
    ),
});

exports.registerUserSchema = Joi.object({
    aws_email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required(),
    last_name: Joi.string().max(45).required(),
    first_name: Joi.string().max(45).required(),
    dev: Joi.string().max(45).required()
});

exports.loginUserSchema = Joi.object({
    aws_email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required(),
});

exports.idSchema = Joi.string().pattern(/^[0-9]+$/, 'numbers');
