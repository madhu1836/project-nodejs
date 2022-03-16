'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminStaticContentController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const DbHandler = dbService.staticContent;
const config = require('../../../config/environments');


module.exports = {
    create: async (req, res) => {
        let responseData = {};
        let reqObj = req.body;
        try {
            
            let Data = {
                title: reqObj.title,
                description: reqObj.description
            }
            let newProfile = await DbHandler.create(Data);
            responseData.msg = "Content Add successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to create Content with error::', error);
            responseData.msg = "failed to create Content";
            return responseHelper.error(res, responseData);
        }
    },
    
    getAll: async (req, res) => {
        let responseData = {};
        try {
            let getContactList = await DbHandler.getByQuery({});
            if(!getContactList.length){
                responseData.msg = "No Such Content exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Content fetched successfully!!!";
            responseData.data = getContactList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch Content with error::', error);
            responseData.msg = 'failed to fetch Content';
            return responseHelper.error(res, responseData);
        }
    },

    getSingle: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getStaticContent = await DbHandler.getById(id);

            if(!getStaticContent){
                responseData.msg = "No such Content exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Contents fetched successfully!!!";
            responseData.data = getStaticContent;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch Content with error::', error);
            responseData.msg = 'failed to fetch Content';
            return responseHelper.error(res, responseData);
        }
    },
    update: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        // console.log("ID===>", id);
        let reqObj = req.body;
        try {
            let getDetailsByQuery = await DbHandler.getById(id);
            if (!getDetailsByQuery) {
                responseData.msg = "This Content does not exist";
                return responseHelper.error(res, responseData);
            }

            // let updatedData = {
            //     movie_thumbnail: fileLocation,
            //     movie_link: reqObj.movie_link,
            //     moviesCategory_id: reqObj.moviesCategory_id,
            //     movie_name: reqObj.movie_name,
            //     description: reqObj.description
            // }

            let updateContent = await DbHandler.updateById(id, reqObj);
            // let updatedMovieData = await moviesDbHandler.getMoviesDetailsById(id)
            responseData.msg = "Content updated successfully!!!";
            responseData.data = updateContent;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update Content with error::', error);
            responseData.msg = "failed to update Content";
            return responseHelper.error(res, responseData);
        }
    },
    delete: async (req, res) => {
        let responseData = {};
        let id =req.params.id
        try {
            let getContent = await DbHandler.getById(id);
            if(!getContent){
                responseData.msg= 'No such Content exist';
                return responseHelper.error(res, responseData);
            }

            let deleteContent= await DbHandler.deleteById(id);
            responseData.msg = "Content Deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete Content with error::', error);
            responseData.msg = 'failed to delete Content';
            return responseHelper.error(res, responseData);
        }
    },

};