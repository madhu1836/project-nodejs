'use strict';
const logger = require('../../../services/logger');
const log = new logger('ContactUsController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const userDbHandler = dbService.User
const DbHandler = dbService.contactUs;
const config = require('../../../config/environments');


module.exports={
    create: async (req, res) => {
        let responseData = {};
        let reqObj = req.body;
        try {
            
            let Data = {
                message: reqObj.message
            }
            let newProfile = await DbHandler.create(Data);
            responseData.msg = "message Sent successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to create message with error::', error);
            responseData.msg = "failed to create Message";
            return responseHelper.error(res, responseData);
        }
    },

};