'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminContactUsController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const DbHandler = dbService.contactUs;
const config = require('../../../config/environments');


module.exports = {
    
    getAll: async (req, res) => {
        let responseData = {};
        try {
            let getContactList = await DbHandler.getDetailsByQuery({});
            if(!getContactList.length){
                responseData.msg = "No Such Messages exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Messages fetched successfully!!!";
            responseData.data = getContactList.reverse();
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch message with error::', error);
            responseData.msg = 'failed to fetch message';
            return responseHelper.error(res, responseData);
        }
    },

    getSingle: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getContact = await DbHandler.getDetailsById(id);

            if(!getContact){
                responseData.msg = "No such Message exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Messages fetched successfully!!!";
            responseData.data = getContact;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch message with error::', error);
            responseData.msg = 'failed to fetch message';
            return responseHelper.error(res, responseData);
        }
    },
    delete: async (req, res) => {
        let responseData = {};
        let id =req.params.id
        try {
            let getMessage = await DbHandler.getDetailsById(id);
            if(!getMessage){
                responseData.msg= 'No such Message exist';
                return responseHelper.error(res, responseData);
            }

            let deleteMessage= await DbHandler.deleteById(id);
            responseData.msg = "Message Deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete message with error::', error);
            responseData.msg = 'failed to delete message';
            return responseHelper.error(res, responseData);
        }
    },

};