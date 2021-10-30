'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminCategoryController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const newsCategoryDbHandler = dbService.NewsCategory;
const config = require('../../../config/environments');


module.exports={
    getSingleNewsCategory: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = req.params.id;
        try {
            let getCategory = await newsCategoryDbHandler.getNewsCategoryDetailsById(id);
            responseData.msg = "data fetched successfully!!!";
            responseData.data = getCategory;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getAllNewsCategory: async (req, res) => {
        let responseData = {};
        let user = req.user;
        try {
            let getCategoryList = await newsCategoryDbHandler.getNewsCategoryDetailsByQuery({});
            responseData.msg = "Data fetched successfully!!!";
            responseData.data = getCategoryList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
}
