const Joi = require("joi")

const catCreationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
})

const subCatCreationSchema = Joi.object({
    catName: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string.required()
})

const catSubCatUpdateSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    id: Joi.number()
})


module.exports = {catCreationSchema, subCatCreationSchema, catSubCatUpdateSchema}