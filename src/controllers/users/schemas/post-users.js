const Joi = require("joi");

exports.postUsersSchema = Joi.object({
  full_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().required().min(8),
  adress: Joi.string(),
});
// brand_name: Joi.string().required(),
// brand_uz_country: Joi.string().required(),
// brand_ru_country: Joi.string().required(),
// brand_en_country: Joi.string().required(),
