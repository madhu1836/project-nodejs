const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Profile Route
 */
const number_validation = /^[0-9]*$/;
const float_number_validation = /^[0-9.]*$/;
module.exports = {
    
    addUser: Joi.object().keys({
    name: Joi.string().trim().min(3).label("User Name"),
    phone_number: Joi.string().min(10).label("Phone Number"),
    user_email: Joi.string().required().label('Email'),
    // user_password: Joi.string().required().label('Password'),
    gender: Joi.string().required().label("Gender"),
  }),
  updateUser: Joi.object().keys({
    name: Joi.string().trim().min(3).label("User Name"),
    phone_number: Joi.string().min(10).label("Phone Number"),
    user_email: Joi.string().required().label('Email'),
    // user_password: Joi.string().optional().allow("").label('Password'),
    gender: Joi.string().required().label("Gender"),
  }),
  
};
