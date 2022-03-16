const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	create_profile: Joi.object().keys({
        pictures:Joi
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
            .valid("male", "female", "others")
            .label('Gender'),  
        about: Joi.string().required().label("About"),
        city: Joi.string().trim().label('City'), 
        country: Joi.string().trim().label("Country"),
        // latitude: Joi.string().label('Latitude'),
        // longitude: Joi.string().label('Longitude')
    }),
    update_profile: Joi.object().keys({
        pictures:Joi
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
            .valid("male", "female", "others")
            .label('Gender'), 
        about: Joi.string().required().label("About"),
        city: Joi.string().trim().label('City'),
        country: Joi.string().trim().label("Country"),
        // latitude: Joi.string().label('Latitude'),
        // longitude: Joi.string().label('Longitude')
	}),

};



