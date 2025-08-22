const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    name: Joi.string().min(3).max(30),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    gender: Joi.string().valid('male', 'female', 'others'),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    email: Joi.string().email().required(), 
    role: Joi.string().valid('user', 'vendor').default('user')
})

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional().messages({
    "string.base":"username must be a string",
    "string.min":"username cannot be less than 3 characters",
    "string.max":"username cannot be more than 30 characters"
  }),
  name: Joi.string().min(3).max(30).optional().messages({
    "string.base":"name must be a string",
    "string.min":"name cannot be less than 3 characters",
    "string.max":"name cannot be more than 30 characters"
  }),
  email: Joi.string().email().optional().messages({
    "string.base":"email must be a string"
  }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  company: Joi.string().optional().messages({
    "string.base":"company must be a string"
  })
})

const deleteUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).alphanum().messages({
    "string.base":"username must be a string",
    "string.min":"username cannot be less than 3 characters",
    "string.max":"username cannot be more than 30 characters"
  }), 

  password: Joi.string().min(3).max(30).alphanum().messages({
    "string.base":"password must be a string",
    "string.min": "password cannot be less than 3 characters", //i have no intention of someone entering 
    "string.max": "password cannot be more than 30 characters" //1 
  })
})

const verifyOtpSchema = Joi.object({
    email: Joi.string().email(),
    otp: Joi.string()
    .pattern(/^[0-9]{5}$/)
    .required()
    .messages({
      "string.pattern.base": "OTP must be a 5-digit number",
      "string.empty": "OTP is required",
      "any.required": "OTP is required"
    })
})

const verifyResendOtp = Joi.object({
  email:Joi.string().email()
})

const loginSchema = Joi.object({
  cred: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().alphanum().min(3).max(30)
  ).required(),
  password: Joi.string().required().messages({
      "alternatives.match": `"cred" must be a valid email or username`,
    }),
  
});
    
module.exports = {registerSchema, verifyOtpSchema, verifyResendOtp, loginSchema, updateUserSchema, deleteUserSchema}