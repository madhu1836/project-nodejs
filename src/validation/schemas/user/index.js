const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Profile Route
 */
const number_validation = /^[0-9]*$/;
const float_number_validation = /^[0-9.]*$/;
module.exports = {
  updateProfile: Joi.object().keys({
    name: Joi.string().trim().min(3).required().label("User Name"),
    phone_number: Joi.string().min(10).required().label("Phone Number"),
    user_email: Joi.string().required().label('Email'),

  }),
  changePassword: Joi.object().keys({
    old_password: Joi.string().required().label("Old Password"),
    new_password: Joi.string().required().label("New Password"),
    confirm_password: Joi.string().required().valid(Joi.ref('new_password')).label("Confirm Password")
  }),
  
};
