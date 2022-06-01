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
    name: Joi.string().trim().min(3).label("User Name"),
    phone_number: Joi.string().min(10).label("Phone Number"),

  }),
  changePassword: Joi.object().keys({
    old_password: Joi.string().required().label("Old Password"),
    new_password: Joi.string().required().label("New Password"),
    confirm_password: Joi.string()
             .valid(Joi.ref('new_password'))
             .required()
             .error(new Error('Confirm password and user password must be same')),
  }),

  updateLocation: Joi.object().keys({
    address: Joi.string().required().label('Address'),
    latitude: Joi.string().label('Latitude'),
    longitude: Joi.string().label('Longitude')
  }),
  
};
