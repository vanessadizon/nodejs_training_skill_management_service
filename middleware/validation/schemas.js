const Joi = require('@hapi/joi')

const refSchema = Joi.object({
    ref_link: Joi.string().required(),
    ref_category: Joi.number().required(),
    length_in_mins: Joi.number().required()
})

const skillSchema = Joi.object({
    skill_name: Joi.string().required(),
    skill_description: Joi.string().required(),
    references: Joi.array().required()
})

const skillIdSchema = Joi.object({
    skill_id: Joi.number().required()
})

module.exports = {
    skillIdSchema, skillSchema, refSchema
}