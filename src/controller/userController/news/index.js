'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminCategoryController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const newsDbHandler = dbService.News;
const config = require('../../../config/environments');


module.exports={
    getSingleNews: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = req.params.id;
        try {
            let getNews = await newsDbHandler.getNewsDetailsById(id);
            responseData.msg = "data fetched successfully!!!";
            responseData.data = getNews;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getAllNews: async (req, res) => {
        let responseData = {};
        let user = req.user;
        try {
            let getNewsList = await newsDbHandler.getNewsDetailsByQuery({});
            responseData.msg = "Data fetched successfully!!!";
            responseData.data = getNewsList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getAllNewsByCategory: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = req.params.newsCategory_id;
        try {
            let getNews = await newsDbHandler.getNewsDetailsByQuery({ newsCategory_id: id });
            // let getVideoData= await videoDbHandler.getVideoDetailsByQuery({id});
            responseData.msg = "data fetched successfully!!!";

            responseData.data = getNews;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
}
