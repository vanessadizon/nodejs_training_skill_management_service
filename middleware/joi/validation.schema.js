const Joi = require("@hapi/joi");

const skillDetailsSchema = Joi.object({
  skill_name: Joi.string().max(45).required(),
  skill_description: Joi.string().max(100),
  references: Joi.array().items(
    Joi.object({
      ref_link: Joi.string().max(100).required(),
      ref_category: Joi.number().integer(),
      length_in_mins: Joi.number().integer(),
    })
  ),
});

module.exports = skillDetailsSchema;
