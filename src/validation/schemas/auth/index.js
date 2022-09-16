const Joi = require('@hapi/joi');
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {

    login: Joi.object().keys({
        user_email: Joi.string().min(3).required().label('Email'),
        user_password: Joi.string().min(6).required().label('Password'),
    }),

    signup: Joi.object().keys({
        first_name: Joi.string().required().regex(/^[a-zA-Z. ]*$/).error(new Error('FirstName should not contain any special characters and numbers!')),
        last_name: Joi.string().required().regex(/^[a-zA-Z. ]*$/).error(new Error('LastName should not contain any special characters and numbers!')),
        phone_number: Joi.string().min(10).required().label('Phone Number'),
        dob: Joi.string().required().label('Dob'),
        user_email: Joi.string().required().label('Email'),
        user_password: Joi.string().min(6).required().label('Password'),
        confirm_password: Joi.string()
            .valid(Joi.ref('user_password'))
            .required()
            .error(new Error('Confirm password and user password must be same')),
    }),

};