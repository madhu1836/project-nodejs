const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	add_profile: Joi.object().keys({
        profile_image:Joi
            .string()
            .label('Profile Image'),
        name: Joi
			.string()
            .required()
			.label("Name"),
        gender: Joi
			.string()
            .required()
            .allow('Male,Female')
			.label("Gender"),
    }),
    update_profile: Joi.object().keys({
        profile_image:Joi
            .string()
            .label('Profile Image'),
        name: Joi
			.string()
            .required()
			.label("Name"),
        gender: Joi
			.string()
            .required()
			.label("Gender"),
	}),

};
