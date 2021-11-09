const JoiBase = require('@hapi/joi');
const JoiDate = require("@hapi/joi-date");

const Joi = JoiBase.extend(JoiDate);
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
    add_movie: Joi.object().keys({
        movie_thumbnail: Joi
            .string()
            .label('Movie Thumbnail'),
        movie_link: Joi
            .string()
            .required()
            .label("Movie URL"),
        moviesCategory_id: Joi
            .string()
            .required()
            .label("Movie Category Id"),
        movie_name: Joi
            .string()
            .required()
            .label("Movie Name"),
        description: Joi
            .string()
            .allow("")
            .label("Movie Description")

    }),
    update_movie: Joi.object().keys({
        movie_thumbnail: Joi
            .string()
            .label('Movie Thumbnail'),
        movie_link: Joi
            .string()
            .required()
            .label("Movie URL"),
        moviesCategory_id: Joi
            .string()
            .required()
            .label("Movie Category Id"),
        movie_name: Joi
            .string()
            .required()
            .label("Movie Name"),
        description: Joi
            .string()
            .allow("")
            .label("Movie Description")

    }),
};
