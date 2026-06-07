const Joi = require("joi");

const UserSchema = Joi.object({
  listing: Joi.object({
    FullName: Joi.string().required(),
    gmail: Joi.string().required(),
    mobile: Joi.number().required(),
    password: Joi.string().required(),
  }).required(),
});

module.exports = { UserSchema };
