const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	create_profile: Joi.object().keys({
        profile_image:Joi
            .string()
            .label("Profile Image"),
        name: Joi
			.string()
            .required()
			.label("Name"),
        bio: Joi
            .string()
            .optional()
            .allow("")
            .label("Your Bio"),
        profile_email: Joi
            .string()
            .required()
            .label("Your Email"),
        gender: Joi
            .string()
            .required()
            .valid("male", "female")
            .label('Gender'),   
    }),
    update_profile: Joi.object().keys({
        profile_image:Joi
            .string()
            .label("Profile Image"),
        name: Joi
			.string()
            .required()
			.label("Name"),
        gender: Joi
            .string()
            .required()
            .valid("male", "female")
            .label('Gender'),
        profile_email: Joi
            .string()
            .required()
            .label("Your Email"),
        bio: Joi
            .string()
            .optional()
            .allow("")
            .label("Your Bio")
	}),

};



