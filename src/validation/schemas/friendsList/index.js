const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
	add: Joi.object().keys({
        sender_id: Joi.string().required().label("Sender ID"),
        receiver_id: Joi.string().required().label("Receiver ID"),
    }),
    update: Joi.object().keys({
        sender_id: Joi.string().required().label("Sender ID"),
        receiver_id: Joi.string().required().label("Receiver ID"),
    }),
};



