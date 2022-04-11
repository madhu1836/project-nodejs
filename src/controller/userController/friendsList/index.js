'use strict';
const logger = require('../../../services/logger');
const log = new logger('FriendsListController').getChildLogger();
const dbService = require('../../../services/db/services');
const responseHelper = require('../../../services/customResponse');
const DbHandler = dbService.friendsList;
let moduleName = "Friends List";
module.exports = {
    /**
     * Method to handle add Country
     */
    add: async(req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for add Friend List:', reqObj);
        let responseData = {};
        try {
            // let thename = '^'+reqObj.name+'$';
            let checkDetails = await DbHandler.getByQuery({$and:[{receiver_id: reqObj.sender_id}, {sender_id: reqObj.receiver_id}]});
            if (checkDetails.length) {
                let updateData = await DbHandler.updateById({_id:checkDetails[0]._id},{status:1})
                responseData.msg = 'Status Updated!!!';
                return responseHelper.error(res, responseData);
            }
            let checkDetailsData = await DbHandler.getByQuery({$and:[{sender_id: reqObj.sender_id},{receiver_id: reqObj.receiver_id}]});
            if (checkDetailsData.length) {
                responseData.msg = 'Friends List  Already Exist!!!';
                return responseHelper.error(res, responseData);
            }
            let submitData = {
                sender_id: reqObj.sender_id,
                receiver_id: reqObj.receiver_id,
                // status: reqObj.status
            }
<<<<<<< HEAD
            // console.log("==========>",submitData);
            // console.log(submitData);
=======
            console.log("==========>",submitData);
            console.log(submitData);
>>>>>>> 933bea01e803b80554a84c1aebf44d0ec361fc64
            let newDetails = await DbHandler.create(submitData);
            log.info('created in the database collection',newDetails);
            responseData.msg = `${moduleName} created in the database collection!!!`;
            return responseHelper.success(res, responseData);
            
        } catch (error) {
            log.error('failed to create with error::', error);
            responseData.msg = 'failed to create';
            return responseHelper.error(res, responseData);
        }
    },

    rejectProfile: async(req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for Reject Profile:', reqObj);
        let responseData = {};
<<<<<<< HEAD
        // console.log(reqObj);
        try {
            let query = {
                sender_id:reqObj.sender_id,
                receiver_id:reqObj.receiver_id,
                status:2
            }
=======
        console.log(reqObj);
        try {
>>>>>>> 933bea01e803b80554a84c1aebf44d0ec361fc64
            // let thename = '^'+reqObj.name+'$';
            let checkDetails = await DbHandler.getByQuery({$and:[{receiver_id: reqObj.sender_id}, {sender_id: reqObj.receiver_id}]});
            if (checkDetails.length) {
                let updateData = await DbHandler.updateById({_id:checkDetails[0]._id},{status:2})
                responseData.msg = 'Profile Rejected!!!';
                return responseHelper.error(res, responseData);
            }
<<<<<<< HEAD
            let checkDetailsData = await DbHandler.getByQuery(query);
            if (checkDetailsData.length) {
                responseData.msg = 'Rejectd Profile Already Exist!!!';
                return responseHelper.error(res, responseData);
            }
            let createRejectedData =await DbHandler.create(query)
            responseData.msg = 'Request rejected !!!';
            responseData.data = createRejectedData;
            return responseHelper.success(res,responseData);
=======
>>>>>>> 933bea01e803b80554a84c1aebf44d0ec361fc64
        } catch (error) {
            log.error('failed to fetch with error::', error);
            responseData.msg = 'failed to Fetch Data';
            return responseHelper.error(res, responseData);
        }
    },
    getAll: async (req, res) => {
<<<<<<< HEAD
        let reqObj= req.body;
=======
>>>>>>> 933bea01e803b80554a84c1aebf44d0ec361fc64
        let responseData = {};
        try {
            let getList = await DbHandler.getByQuery({});
            if (!getList.length) {
<<<<<<< HEAD
                responseData.msg = `No such ${moduleName} exist!!!`;
=======
                responseData.msg = `No Such ${moduleName} exists`;
>>>>>>> 933bea01e803b80554a84c1aebf44d0ec361fc64
                return responseHelper.error(res, responseData);
            }
            responseData.msg = `All ${moduleName} fetch successfully!!!`;
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    /**
     * Method to handle single data 
     */
    getById: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getSingle = await DbHandler.getById(id);
            if (!getSingle) {
                responseData.msg = `No such ${moduleName} exist!!!`;
                return responseHelper.error(res, responseData);
            }
            responseData.msg = `${moduleName} fetch successfully!!!`;
            responseData.data = getSingle;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    /**
     * Method to handle Update
     */
    update: async(req, res) => {
        let reqObj = req.body; 
        let id = req.params.id;
        log.info('Recieved request for Update :', reqObj);
        let responseData = {};
        try {
            let DetailsData = await DbHandler.getByQuery({$and:[{receiver_id: reqObj.receiver_id}, {sender_id: reqObj.sender_id}]});
            if (!DetailsData) {
                responseData.msg = `${moduleName} does not exist!!!`;
                return responseHelper.error(res, responseData);
            }
            let updatedObj = {
                name:reqObj.name,
                institution_id: reqObj.institution_id,
                faculty_id: reqObj.faculty_id,
            }
            let updateDetails = await DbHandler.updateById(id, updatedObj);
            responseData.msg = `${moduleName} updated successfully!!!`;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to get with error::', error);
            responseData.msg = 'failed to get data';
            return responseHelper.error(res, responseData);
        }
    },
    /**
     * Method to handle Delete 
     */
    delete: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let Details = await DbHandler.getById(id);
            if(!Details){
                responseData.msg= `No such ${moduleName} exist`;
                return responseHelper.error(res, responseData);
            }
            let deleteDetails = await DbHandler.deleteById(id);
            responseData.msg = `${moduleName} delete successfully!!!`;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete with error::', error);
            responseData.msg = 'failed to delete data';
            return responseHelper.error(res, responseData);
        }
    }
}