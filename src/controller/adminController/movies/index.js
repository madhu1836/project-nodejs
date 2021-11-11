'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminAuthController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const moviesDbHandler = dbService.Movies;
const config = require('../../../config/environments');


module.exports = {
    addMovie: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = admin.sub;
        // console.log("ID===>",id);
        let reqObj = req.body;
        try {
            let getMovieDetailsByQuery = await moviesDbHandler.getMoviesDetailsByQuery({ movie_name: reqObj.movie_name });
            if (getMovieDetailsByQuery.length) {
                responseData.msg = "This movie already exist";
                return responseHelper.error(res, responseData);
            }

            let fileLocation = '';

            if (req.file) {
                fileLocation = req.file.location;
            }
            let Data = {
                movie_thumbnail: fileLocation,
                movie_link: reqObj.movie_link,
                moviesCategory_id: reqObj.moviesCategory_id,
                movie_name: reqObj.movie_name,
                description: reqObj.description
            }
            if(!Data.movie_thumbnail){
                responseData.msg = "Failed to upload movie thumbnail";
                return responseHelper.error(res, responseData)
            }

            let Movie = await moviesDbHandler.createMovies(Data);
            responseData.msg = "Movie added successfully!!!";
            responseData.data = Movie;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to add movie with error::', error);
            responseData.msg = "failed to add movie";
            return responseHelper.error(res, responseData);
        }
    },
    getAllMovies: async (req, res) => {
        let responseData = {};
        try {
            let getNewsList = await moviesDbHandler.getMoviesDetailsByQuery({});
            if(!getNewsList.length){
                responseData.msg = "No movies exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Movies fetched successfully!!!";
            responseData.data = getNewsList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movies with error::', error);
            responseData.msg = 'failed to fetch movies';
            return responseHelper.error(res, responseData);
        }
    },

    getSingleMovie: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        try {
            let getAdmin = await moviesDbHandler.getMoviesDetailsById(id);
            if(!getAdmin){
                responseData.msg = "No such movie exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "movie fetched successfully!!!";
            responseData.data = getAdmin;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movie with error::', error);
            responseData.msg = 'failed to fetch movie';
            return responseHelper.error(res, responseData);
        }
    },

    updateMovie: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        // let id = admin.sub;
        console.log("ID===>", id);
        let reqObj = req.body;
        try {
            let getMovieDetailsByQuery = await moviesDbHandler.getMoviesDetailsById(id);
            if (!getMovieDetailsByQuery) {
                responseData.msg = "This movie does not exist";
                return responseHelper.error(res, responseData);
            }

            let fileLocation = '';

            if (req.file) {
                fileLocation = req.file.location;
            }

            let updatedData = {
                movie_thumbnail: fileLocation,
                movie_link: reqObj.movie_link,
                moviesCategory_id: reqObj.moviesCategory_id,
                movie_name: reqObj.movie_name,
                description: reqObj.description
            }
            if(!updatedData.movie_thumbnail){
                responseData.msg = "Failed to upload movie thumbnail";
                return responseHelper.error(res, responseData)
            }

            let updateMovie = await moviesDbHandler.updateMoviesDetailsById(id, updatedData,);
            let updatedMovieData = await moviesDbHandler.getMoviesDetailsById(id)
            responseData.msg = "Movie updated successfully!!!";
            responseData.data = updatedMovieData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update Movie with error::', error);
            responseData.msg = "failed to update Movie";
            return responseHelper.error(res, responseData);
        }
    },
    deleteSingleMovie: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id =req.query.id
        try {
            let getMovie = await moviesDbHandler.getMoviesDetailsById(id);
            if(!getMovie){
                responseData.msg= 'No such movie exist in database';``
                return responseHelper.error(res, responseData);
            }

            let deleteMovie= await moviesDbHandler.deleteMoviesById(id);
            responseData.msg = "movie Deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete movie with error::', error);
            responseData.msg = 'failed to delete movie';
            return responseHelper.error(res, responseData);
        }
    },


};