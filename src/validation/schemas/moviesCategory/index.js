const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	add_noviesCategory: Joi.object().keys({
		movies_category: Joi
			.string()
			.required()
			.label("Movies category name")
	}),
	update_moviesCategory: Joi.object().keys({
		movies_category: Joi
			.string()
			.required()
			.label("Movies category name")
	}),

};
