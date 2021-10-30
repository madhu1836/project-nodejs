const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	add_news: Joi.object().keys({
        news_image:Joi
            .string()
            .label('News Image'),
        news_heading: Joi
			.string()
            .required()
			.label("News Heading"),
		short_description: Joi
			.string()
            .required()
			.label("Short description of news"),
	    detail_description: Joi
			.string()
			.allow("")
			.label("Detail description of news"),
		newsCategory_id: Joi
			.string()
			.required()
			.label("News category id")
		
	}),
    update_news: Joi.object().keys({
        news_image:Joi
            .string()
            .label('News Image'),
        news_heading: Joi
			.string()
			.label("News Heading"),
		short_description: Joi
			.string()
			.label("Short description of news"),
	    detail_description: Joi
			.string()
			.label("Detail description of news"),
		newsCategory_id: Joi
			.string()
			.required()
			.label("News category id")
		
	}),

	
};
