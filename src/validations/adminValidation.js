const Joi = require("joi");

const vendorApproveRejectSchema = Joi.object({
  status: Joi.string()
    .valid("approved", "rejected")
    .required()
    .messages({
      "string.empty": "Please select either 'approved' or 'rejected' for this vendor request",
    }),

  userId: Joi.number().required().messages({
    "any.required": "userId is required",
  }),

  logId: Joi.number().required().messages({
    "any.required": "logId is required",
  }),
});

module.exports = { vendorApproveRejectSchema };
