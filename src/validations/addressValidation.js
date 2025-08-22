const Joi = require("joi");

const addressCreateSchema = Joi.object({
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.base": "pincode must be a string",
      "string.pattern.base": "Pincode must exactly be 6 digits",
      "any.required": "pincode is required",
    }),
  addressLine1: Joi.string().min(5).max(300).required().messages({
    "string.base": "addressLine1 must be a string",
    "any.required": "addressLine1 is required",
    "string.max": "addressLine1 cannot be longer than 300 characters",
    "string.min": "addressLine1 cannot be less than 5 characters",
  }),
  addressLine2: Joi.string().min(5).max(300).optional().messages({
    "string.base": "addressLine2 must be a string",
    "string.max": "addressLine2 cannot be longer than 300 characters",
    "string.min": "addressLine2 cannot be less than 5 characters",
  }),
  city: Joi.string().min(3).max(30).required().messages({
    "string.base": "city must be a string",
    "any.required": "city is required",
    "string.max": "city name cannot be longer than 30 characters",
    "string.min": "city name cannot be less than 3 characters",
  }),
  district: Joi.string().min(2).max(50).required().messages({
    "string.base": "district must be a string",
    "any.required": "district is required",
    "string.min": "district must be at least 2 characters",
    "string.max": "district cannot be longer than 50 characters",
  }),
  state: Joi.string().min(2).max(50).required().messages({
    "string.base": "state must be a string",
    "any.required": "state is required",
    "string.min": "state must be at least 2 characters",
    "string.max": "state cannot be longer than 50 characters",
  }),
  country: Joi.string().min(3).max(60).optional().messages({
    "string.base": "country must be a string",
    "string.min": "country must be at least 3 characters",
    "string.max": "country cannot be longer than 60 characters",
  }),
  type: Joi.string().valid("home", "work").optional().messages({
    "string.base": "address type must be a string",
    "any.only": "address type must be either 'home' or 'work'",
  }),
  isDefault: Joi.boolean().optional().messages({
    "boolean.base": "isDefault must be true or false",
  }),
});

module.exports = {addressCreateSchema}
