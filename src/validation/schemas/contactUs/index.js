const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	create: Joi.object().keys({
        message: Joi
			.string()
            .required()
			.label("Message"),
    }),

};



