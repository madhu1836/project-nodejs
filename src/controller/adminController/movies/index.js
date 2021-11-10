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
    getAllNews: async (req, res) => {
        let responseData = {};
        try {
            let getNewsList = await newsDbHandler.getNewsDetailsByQuery({});
            if(!getNewsList.length){
                responseData.msg = "No news exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "News fetched successfully!!!";
            responseData.data = getNewsList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch news with error::', error);
            responseData.msg = 'failed to fetch news';
            return responseHelper.error(res, responseData);
        }
    },

    getSingleNews: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        try {
            let getAdmin = await newsDbHandler.getNewsDetailsById(id);
            if(!getAdmin){
                responseData.msg = "No such news exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "news fetched successfully!!!";
            responseData.data = getAdmin;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch news with error::', error);
            responseData.msg = 'failed to fetch news';
            return responseHelper.error(res, responseData);
        }
    },

    updateNews: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        // let id = admin.sub;
        console.log("ID===>", id);
        let reqObj = req.body;
        try {
            let getNewsDetailsByQuery = await newsDbHandler.getNewsDetailsById(id);
            if (!getNewsDetailsByQuery) {
                responseData.msg = "This news does not exist";
                return responseHelper.error(res, responseData);
            }

            let fileLocation = '';

            if (req.file) {
                fileLocation = req.file.location;
            }

            let updatedData = {
                news_image: fileLocation,
                news_heading: reqObj.news_heading,
                short_description: reqObj.short_description,
                detail_description: reqObj.detail_description,
                newsCategory_id: reqObj.newsCategory_id
            }

            let updateNews = await newsDbHandler.updateNewsDetailsById(id, updatedData,);
            responseData.msg = "News updated successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update News with error::', error);
            responseData.msg = "failed to update News";
            return responseHelper.error(res, responseData);
        }
    },
    deleteSingleNews: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id =req.query.id
        try {
            let getNews = await newsDbHandler.getNewsDetailsById(id);
            if(!getNews){
                responseData.msg= 'No such news exist in database';
                return responseHelper.error(res, responseData);
            }

            let deleteNews= await newsDbHandler.deleteNewsById(id);
            responseData.msg = "News Deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete news with error::', error);
            responseData.msg = 'failed to delete news';
            return responseHelper.error(res, responseData);
        }
    },


};