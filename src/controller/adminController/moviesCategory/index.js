'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminMoviesCategoryController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const moviesCategoryDbHandler = dbService.MoviesCategory;
const config = require('../../../config/environments');
const { response } = require('express');


module.exports = {

    Add_MoviesCategory: async (req, res) => {
        let reqObj = req.body;
        let admin = req.admin;
        log.info('Recieved request for add category:', reqObj);
        let responseData = {};
        console.log(reqObj);
        try {
            let checkMoviesCategory_name = await moviesCategoryDbHandler.getMoviesCategoryDetailsByQuery({ movies_category: reqObj.movies_category });
            if (checkMoviesCategory_name.length) {
                responseData.msg = 'Category Name Already Exist !!!';
                return responseHelper.error(res, responseData);
            }
            let fileLocation = '';

            if (req.file) {
                fileLocation = req.file.location;
            }
            let submitData = {
                movies_category: reqObj.movies_category,
                category_thumbnail: fileLocation,
            }
            if(!submitData.category_thumbnail){
                responseData.msg = "Failed to upload thumbnail";
                return responseHelper.error(res, responseData)
            }
            let newMovies_category = await moviesCategoryDbHandler.createMoviesCategory(submitData);
            log.info('Category name created in the database collection', newMovies_category);
            responseData.msg = 'Category name created successfully';
            // responseData.data = newMovies_category;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to create category with error::', error);
            responseData.msg = 'failed to create category.';
            return responseHelper.error(res, responseData);
        }
    },

    getSingleMovieCategory: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
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

    updateMovieCategory: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        let reqObj = req.body;
        try {
            let getCategoryDetailsByQuery = await moviesCategoryDbHandler.getMoviesCategoryDetailsById(id);
            if (!getCategoryDetailsByQuery) {
                responseData.msg = "This category does not exist!!!";
                return responseHelper.error(res, responseData);
            }
            let updatedData = {
                movies_category: reqObj.movies_category
            }
            let updateCategoryData = await moviesCategoryDbHandler.updateMoviesCategoryDetailsById(id, updatedData);
            let updateData = await moviesCategoryDbHandler.getMoviesCategoryDetailsById(id);
            responseData.msg = "data updated successfully!!!";
            responseData.data = updateData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "failed to update data";
            return responseHelper.error(res, responseData);
        }
    },
    deleteMoviesCategory: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        try {
            let getCategory = await moviesCategoryDbHandler.getMoviesCategoryDetailsById(id);
            if(!getCategory){
                responseData.msg = "Category does not exist!!!";
                return responseHelper.error(res,responseData);
            }
            let deleteCategory = await getCategory.delete();
            responseData.msg = "category deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete category with error::', error);
            responseData.msg = 'failed to fetch data';s
            return responseHelper.error(res, responseData);
        }
    },

}
