'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserMovieController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const moviesDbHandler = dbService.Movies;
const config = require('../../../config/environments');


module.exports = {
    getAllMovies: async (req, res) => {
        let responseData = {};
        try {
            let getMoviesList = await moviesDbHandler.getMoviesDetailsByQuery({}).sort({ 'created_at': -1 });
            if (!getMoviesList.length) {
                responseData.msg = "No movies exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Movies fetched successfully!!!";
            responseData.data = getMoviesList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movies with error::', error);
            responseData.msg = 'failed to fetch movies';
            return responseHelper.error(res, responseData);
        }
    },

    getSingleMovie: async (req, res) => {
        let responseData = {};
        let id = req.query.id;
        try {
            let getMovie = await moviesDbHandler.getMoviesDetailsById(id);
            if (!getMovie) {
                responseData.msg = "No such movie exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "movie fetched successfully!!!";
            responseData.data = getMovie;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movie with error::', error);
            responseData.msg = 'failed to fetch movie';
            return responseHelper.error(res, responseData);
        }
    },
    getMoviesByCategoryId: async (req, res) => {
        let responseData = {}
        let id = req.query.id;
        try {
            let getMovies = await moviesDbHandler.getMoviesDetailsByQuery({ category_id: id }).sort({ 'created_at': -1 });
            if (!getMovies.length) {
                responseData.msg = "No movie exists in this category!!!";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Movies in this category are fetched successfully!!!";
            responseData.data = getMovies
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movies with error::', error);
            responseData.msg = 'failed to fetch movies';
            return responseHelper.error(res, responseData);
        }
    }


};