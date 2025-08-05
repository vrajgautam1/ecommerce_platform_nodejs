const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    name: Joi.string().min(3).max(30),

    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    gender: Joi.string().valid('male', 'female', 'others'),

    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    
    email: Joi.string().email()
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
    
module.exports = {registerSchema, verifyOtpSchema, verifyResendOtp, loginSchema}