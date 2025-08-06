const Joi = require("joi");

const vendorApplyingFormSchema = Joi.object({
  addressLine1: Joi.string().required().messages({
    "string.empty": "Address Line 1 is required",
  }),
  addressLine2: Joi.string().optional().allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .required(), // Indian PIN
  PAN: Joi.string()
    .pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
    .required(),
  gstNumber: Joi.string()
    .optional()
    .allow("")
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
  businessName: Joi.string().required().messages({
    "string.empty": "business name cannot be empty please enter business name",
  }),
  businessType: Joi.string().optional().allow(""),
  email: Joi.string().email().required().messages({
    "string.empty": "email cannot be empty",
  }),
  businessPhone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .required()
    .messages({
      "string.empty": "phone number cannot be empty",
      "string.pattern.base":
        "phone number is invalid, please enter a valid 10 digit indian phone number",
    }), // Indian mobile
});

module.exports = {vendorApplyingFormSchema}