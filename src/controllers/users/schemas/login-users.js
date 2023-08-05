const Joi = require("joi");

exports.loginUsersSchema = Joi.object({
  phone_number: Joi.string().required(),
  password: Joi.string().required().min(8),
});
