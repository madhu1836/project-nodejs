const Joi = require('@hapi/joi');
/**
 * JOI Validation Schema for Auth Route
 */
module.exports = {
    search_movie: Joi.object().keys({
        movie_name: Joi.string().required().label('Movie Name'),
    }),
  
    
};