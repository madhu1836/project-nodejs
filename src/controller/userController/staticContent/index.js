'use strict';
const logger = require('../../../services/logger');
const log = new logger('StaticContentController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const DbHandler = dbService.staticContent;
const config = require('../../../config/environments');


module.exports = {
    
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

};