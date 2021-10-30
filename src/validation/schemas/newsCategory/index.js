const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	add_newsCategory: Joi.object().keys({
		news_category: Joi
			.string()
			.required()
			.label("News category name")
	}),
	update_newsCategory: Joi.object().keys({
		news_category: Joi
			.string()
			.required()
			.label("News category name")
	}),

};
