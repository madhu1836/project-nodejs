const JoiBase = require("@hapi/joi");
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Profile Route
 */
const number_validation = /^[0-9]*$/;
const float_number_validation = /^[0-9.]*$/;
module.exports = {
  saveDriver: Joi.object().keys({
    first_name: Joi.string().trim().required().label("Fist Name"),
    last_name: Joi.string().trim().required().label("Last Name"),
    mailing_address: Joi.string().allow("").label("Mailing Address"),
    street: Joi.string().trim().allow("").label("Street Address"),
    street2: Joi.string().trim().allow("").label("Street Address Line 2"),
    city: Joi.string().trim().allow("").label("City"),
    state: Joi.string().trim().allow("").label("State"),
    zip: Joi.string().trim().allow("").label("Zip"),
    country: Joi.string().trim().allow("").optional().label("Country"),
    area_code: Joi.string().trim().required().label("Area Code"),
    phone_number: Joi.string().trim().min(6).max(12).required().label("Phone Number"),
    email: Joi.string().trim().email().required().label("Email"),
    location: Joi.string().trim().required().label("Location"),
    prefer_start_date: Joi.date().required().label("Start Date"),
    password: Joi.string().allow("").optional().label("Password"),
    confirm_password: Joi.string().allow("").optional().valid(Joi.ref('password')).error(new Error('Confirm password and password must be same')),
  }),

  saveDriverAdmin: Joi.object().keys({
    first_name: Joi.string().trim().required().label("Fist Name"),
    last_name: Joi.string().trim().required().label("Last Name"),
    mailing_address: Joi.string().allow("").label("Mailing Address"),
    street: Joi.string().trim().allow("").label("Street Address"),
    street2: Joi.string().trim().allow("").label("Street Address Line 2"),
    city: Joi.string().trim().allow("").label("City"),
    state: Joi.string().trim().allow("").label("State"),
    zip: Joi.string().trim().allow("").label("Zip"),
    country: Joi.string().trim().allow("").optional().label("Country"),
    area_code: Joi.string().trim().required().label("Area Code"),
    phone_number: Joi.string().trim().min(6).max(12).required().label("Phone Number"),
    email: Joi.string().trim().email().required().label("Email"),
    location: Joi.string().trim().required().label("Location"),
    prefer_start_date: Joi.date().required().label("Start Date"),
    password: Joi.string().min(8).required().label("Password"),
    confirm_password: Joi.string().valid(Joi.ref('password')).error(new Error('Confirm password and password must be same')),
    is_verify: Joi.string().optional().label("Is Verified"),
  }),

  updateDriverAdmin: Joi.object().keys({
    first_name: Joi.string().trim().required().label("Fist Name"),
    last_name: Joi.string().trim().required().label("Last Name"),
    mailing_address: Joi.string().allow("").label("Mailing Address"),
    street: Joi.string().trim().allow("").label("Street Address"),
    street2: Joi.string().trim().allow("").label("Street Address Line 2"),
    city: Joi.string().trim().allow("").label("City"),
    state: Joi.string().trim().allow("").label("State"),
    zip: Joi.string().trim().allow("").label("Zip"),
    country: Joi.string().trim().allow("").optional().label("Country"),
    area_code: Joi.string().trim().required().label("Area Code"),
    phone_number: Joi.string().trim().min(6).max(12).required().label("Phone Number"),
    email: Joi.string().trim().email().required().label("Email"),
    location: Joi.string().trim().required().label("Location"),
    prefer_start_date: Joi.date().required().label("Start Date"),
    password: Joi.string().allow("").min(8).label("Password"),
    confirm_password: Joi.string().allow("").valid(Joi.ref('password')).error(new Error('Confirm password and password must be same')),
    is_verify: Joi.string().optional().label("Is Verified"),
  }),
};
