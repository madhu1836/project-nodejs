'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminCategoryController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const moviesCategoryDbHandler = dbService.MoviesCategory;
const config = require('../../../config/environments');


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
            let submitData = {
                movies_category: reqObj.movies_category
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

    getSingleNewsCategory: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        try {
            let getCategory = await newsCategoryDbHandler.getNewsCategoryDetailsById(id);
            responseData.msg = "news categories fetched successfully!!!";
            responseData.data = getCategory;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch news categories with error::', error);
            responseData.msg = 'failed to fetch news categories';
            return responseHelper.error(res, responseData);
        }
    },
    getAllcategory: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        try {
            let getCategoryList = await newsCategoryDbHandler.getNewsCategoryDetailsByQuery({});
            responseData.msg = "News Catagories fetched successfully!!!";
            responseData.data = getCategoryList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch news categories with error::', error);
            responseData.msg = 'failed to fetch news categories';
            return responseHelper.error(res, responseData);
        }
    },
    
    updateNewsCategory: async (req, res) => {
        let responseData = {};
        // console.log("testtt")
        let admin = req.admin;
        let id = req.query.id;
        // let id = admin._id;
        console.log("ID===>", id);
        let reqObj = req.body;
        try {
            let getCategoryDetailsByQuery = await newsCategoryDbHandler.getNewsCategoryDetailsByQuery({ _id: id });
            if (getCategoryDetailsByQuery[0]._id != id) {
                responseData.msg = "This Category name already exists";
                return responseHelper.error(res, responseData);
            }
            let updatedData = {
                news_category: reqObj.news_category
            }
            let updateCategoryData = await newsCategoryDbHandler.updateNewsCategoryDetailsById(id, updatedData);
            let updateData = await newsCategoryDbHandler.getNewsCategoryDetailsById(id);
            responseData.msg = "data updated successfully!!!";
            responseData.data = updateData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "failed to update data";
            return responseHelper.error(res, responseData);
        }
    },
    deleteNewsCategory: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = req.query.id;
        try {
            let getCategory = await newsCategoryDbHandler.getNewsCategoryDetailsById(id);
            let deleteCategory = await getCategory.delete();
            responseData.msg = "category deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete category with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

}
