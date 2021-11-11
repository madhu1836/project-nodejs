'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserMoviesCategoryController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const moviesCategoryDbHandler = dbService.MoviesCategory;
const config = require('../../../config/environments');
const { response } = require('express');


module.exports = {
    getSingleMovieCategory: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = req.query.id;
        try {
            let getCategory = await moviesCategoryDbHandler.getMoviesCategoryDetailsById(id);
            if (!getCategory) {
                responseData.msg = "Category does not exist!!!";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "movie category fetched successfully!!!";
            responseData.data = getCategory;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movie category with error::', error);
            responseData.msg = 'failed to fetch movie category';
            return responseHelper.error(res, responseData);
        }
    },
    getAllcategories: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        try {
            let getCategoryList = await moviesCategoryDbHandler.getMoviesCategoryDetailsByQuery({});
            if (!getCategoryList.length) {
                responseData.msg = "Categories does not exist!!!";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Movie Catagories fetched successfully!!!";
            responseData.data = getCategoryList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch movie categories with error::', error);
            responseData.msg = 'failed to fetch movie categories';
            return responseHelper.error(res, responseData);
        }
    },

    

}
