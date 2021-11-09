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
        let id = req.query.id;
        try {
            let getNews = await newsDbHandler.getNewsDetailsById(id);
            if(!getNews){
                responseData.msg = "No such news exist";
                return responseHelper.error(res, responseData);
            }   
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
            if(!getNewsList.length){
                responseData.msg = "No news available in this category";
                return responseHelper.error(res, responseData);
            }
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
        let id = req.query.newsCategory_id;
        try {
            let getNews = await newsDbHandler.getNewsDetailsByQuery({ newsCategory_id: id });
            if(!getNews.length){
                responseData.msg = "No news available in this category";
                return responseHelper.error(res, responseData);
            }
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
