const Joi = require('@hapi/joi');

const skillIdSchema = Joi.object({
  skill_id: Joi.number().required(),
});

const skillDetailsSchema = Joi.object({
  skill_name: Joi.string().max(45).required(),
  skill_description: Joi.string().max(100),
  references: Joi.array().items(
    Joi.object({
      ref_link: Joi.string().max(100).required(),
      ref_category: Joi.number().integer().valid(0, 1, 2),
      length_in_mins: Joi.number().integer(),
    })
  ),
});

const userSchema = Joi.object({
  aws_email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).min(8).required(),
  last_name: Joi.string().max(45).required(),
  first_name: Joi.string().max(45).required(),
  dev: Joi.string().max(45).required(),
});

const loginSchema = Joi.object({
  aws_email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).required(),
});

module.exports = { skillDetailsSchema, userSchema, loginSchema, skillIdSchema };
