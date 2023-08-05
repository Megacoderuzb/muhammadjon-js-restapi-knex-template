const Joi = require("joi");

exports.patchUsersSchema = Joi.object({
  full_name: Joi.string(),
  phone_number: Joi.string(),
  email: Joi.string(),
  password: Joi.string().min(8),
  adress: Joi.string(),
  brand_name: Joi.string(),
  brand_uz_country: Joi.string(),
  brand_ru_country: Joi.string(),
  brand_en_country: Joi.string(),
  role: Joi.string().valid("admin"),
});
