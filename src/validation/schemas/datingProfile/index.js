const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	create_profile: Joi.object().keys({
        profile_picture:Joi
            .string()
            .label("Profile Image"),
        age: Joi
			.number()
            .required()
			.label("Age"),
        height: Joi
			.string()
            .required()
			.label("Height"),
        weight: Joi
			.number()
            .required()
			.label("Weight"),
        looking_for: Joi
            .string()
            .required()
            .valid("Men", "Women", "Others")
            .label('Looking For'),  
        about: Joi.string().required().label("About"),
    }),
    update_profile: Joi.object().keys({
        profile_picture:Joi
            .string()
            .label("Profile Image"),
        age: Joi
			.number()
            .required()
			.label("Age"),
        height: Joi
			.string()
            .required()
			.label("Height"),
        weight: Joi
			.number()
            .required()
			.label("Weight"),
        looking_for: Joi
            .string()
            .required()
            .valid("Men", "Women", "Others")
            .label('Looking For'), 
        about: Joi.string().required().label("About"),
	}),

};



