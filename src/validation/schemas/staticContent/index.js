const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	create: Joi.object().keys({
        title: Joi.string().required().label("Title"),
        description: Joi.string().required().label("Description"),
    }),
    update: Joi.object().keys({
        title: Joi.string().required().label("Title"),
        description: Joi.string().required().label("Description"),
    }),
};



