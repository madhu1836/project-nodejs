'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserAuthController').getChildLogger();
const dbService = require('../../../services/db/services');
const responseHelper = require('../../../services/customResponse');
const DbHandler = dbService.Details;



module.exports = {


    createDetails: async (req, res) => {
        let reqObj = req.body;
        let userId = req.user.sub
        let responseData = {};
        log.info('Recieved request for Profile:', reqObj);
        try {
            let checkDetails = await DbHandler.getUserDetailsByQuery({ user_id: userId });
            if (checkDetails.length) {
                responseData.msg = 'Details Already Exist !!!';
                return responseHelper.error(res, responseData);
            }


            let submitData = {
                father_name: reqObj.father_name,
                mother_name: reqObj.mother_name,
                wife: reqObj.wife,
                no_of_children: reqObj.no_of_children,
                user_id: userId,
            }
            let newDetails = await DbHandler.create(submitData);
            log.info('Profile Created in the database collection', newDetails);
            responseData.msg = 'your account has been created successfully!';
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to get user signup with error::', error);
            responseData.msg = 'failed to create Profile';
            return responseHelper.error(res, responseData);
        }
    },



    updateDetails: async (req, res) => {
        let reqObj = req.body;
        let id = req.params.id
        log.info('Recieved request for Profile Update:', reqObj);
        let responseData = {};
        try {

            let getData = await DbHandler.getDetailsById(id)
            if (!getData) {
                responseData.msg = 'Details Does not Exist!';
                return responseHelper.error(res, responseData);
            }

            let UpdatedData = await DbHandler.updateDetailsById(id, reqObj)
            responseData.data = 'Profile Update Successfully'
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to get Data with error::', error);
            responseData.msg = 'failed to get data';
            return responseHelper.error(res, responseData);
        }
    },


    getDetailsId: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getProfileData = await DbHandler.getDetailsByQuery({ user_id: id });
            if (!getProfileData) {
                responseData.msg = "No such Profile exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Profile fetched successfully!!!";
            responseData.data = getProfileData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch Data with error::', error);
            responseData.msg = 'failed to fetch Data';
            return responseHelper.error(res, responseData);
        }
    },

    deleteDetails: async (req, res) => {
        let responseData = {};
        let id = req.params.id
        try {
            let getData = await DbHandler.getUserDetailsById(id);
            if (!getData) {
                responseData.msg = 'No such Details exist';
                return responseHelper.error(res, responseData);
            }

            let deleteData = await DbHandler.deleteUserById(id);
            responseData.msg = "Deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete with error::', error);
            responseData.msg = 'failed to delete data';
            return responseHelper.error(res, responseData);
        }
    },





};