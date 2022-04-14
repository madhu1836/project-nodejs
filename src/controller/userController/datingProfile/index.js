'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserDatingController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const userDbHandler = dbService.User
const datingDbHandler = dbService.DatingProfile;
const config = require('../../../config/environments');


module.exports={
    // createDatingProfile: async (req, res) => {
    //     let responseData = {};
    //     let user = req.user;
    //     let id = user.sub;
    //     // console.log("ID===>",id);
    //     let reqObj = req.body;
    //     try {
    //         // let getProfileDetailsByQuery = await datingDbHandler.getProfileDetailsByQuery({user_id: { $eq: id}});
    //         // if (getProfileDetailsByQuery.length) {
    //         //     responseData.msg = "Your dating profile already exist";
    //         //     return responseHelper.error(res, responseData);
    //         // }

    //         let filelocation = [];    
    //         if (!req.file && !req.files.pictures) {
    //             responseData.msg = "Failed to upload pictures";
    //             return responseHelper.error(res, responseData);
    //     }
    //         if (req.files && req.files.pictures) {
    //             for (let i = 0; i < req.files.pictures.length; i++) {
    //                 filelocation.push(req.files.pictures[i].location);
    //             }
    //         }
    //         let Data = {
    //             pictures: filelocation,
    //             age: reqObj.age,
    //             height: reqObj.height,
    //             weight: reqObj.weight,
    //             looking_for: reqObj.looking_for,
    //             about: reqObj.about,
    //         }
    //         let newProfile = await datingDbHandler.createProfile(Data);
    //         responseData.msg = "Dating profile created successfully!!!";
    //         return responseHelper.success(res, responseData);
    //     } catch (error) {
    //         log.error('failed to create dating profile with error::', error);
    //         responseData.msg = "failed to create dating profile";
    //         return responseHelper.error(res, responseData);
    //     }
    // },
    updateDatingProfile: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = user.sub;
        let reqObj = req.body;
        try {
            let getProfileDetailsByQuery = await datingDbHandler.getProfileDetailsById(id);
            if (!getProfileDetailsByQuery) {
                responseData.msg = "Dating profile does not exist";
                return responseHelper.error(res, responseData);
            }
            // console.log('=====profile',getProfileDetailsByQuery)
            // let checkDetails = await datingDbHandler.getProfileDetailsByQuery({$and:[{age: reqObj.age}, {height: reqObj.height}, {weight: reqObj.weight}]});
            if (getProfileDetailsByQuery.age || getProfileDetailsByQuery.height || getProfileDetailsByQuery.weight) {
                 let updatedData = await datingDbHandler.updateProfileDetailsById({_id:getProfileDetailsByQuery._id},{profile_created:1})
            }
            let filelocation = [];
            // console.log('======length',getProfileDetailsByQuery[0].pictures.length)
            // for (let i = 0; i < getProfileDetailsByQuery[0].pictures.length; i++){
            //     console.log('========>',getProfileDetailsByQuery[0].pictures[i])
            //     filelocation.push(getProfileDetailsByQuery[0].pictures[i])
            // }
            // filelocation = getProfileDetailsByQuery[0].pictures;
            // oldphotos = [];
            // let filelocation = [];
            if (req.files && req.files.pictures) {
                // filelocation = []
                for (let i = 0; i < req.files.pictures.length; i++) {
                    filelocation.push(req.files.pictures[i].location);
                }
                reqObj.pictures = filelocation;
            }
            
            // let fileLocation = '';
            // if (req.file) {
            //     fileLocation = req.file.location;
            // }
            // if(req.files && req.files.fileLocation){
            //     reqObj.fileLocation = req.files.fileLocation[0].location
            // }
            // let updateData = {
            //     pictures: filelocation,
            //     age: reqObj.age,
            //     height: reqObj.height,
            //     weight: reqObj.weight,
            //     looking_for: reqObj.looking_for,
            //     about: reqObj.about,
            // }
            let updatingData = await datingDbHandler.updateProfileDetailsById(id,reqObj);
            responseData.msg = "Dating profile updated successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update dating profile with error::', error);
            responseData.msg = "failed to update dating profile";
            return responseHelper.error(res, responseData);
        }
    },
    getAllProfiles: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = user.sub;
        let reqObj = req.body;
        try {  
            let getProfileList = await datingDbHandler.getProfileDetailsByQuery({ $and: [ {age: reqObj.age}, {height: reqObj.height},{weight: reqObj.weight} ] })
            if (!getProfileList.length) {
                responseData.msg = "Dating profile does not exist";
                return responseHelper.error(res, responseData);
            }
                responseData.msg = "Data Fetched Successfully !!!"; 
                responseData.data = getProfileList;
                return responseHelper.success(res, responseData);        
        } catch (error) {
            log.error('failed to fetch profiles with error::', error);
            responseData.msg = 'failed to fetch profiles';
            return responseHelper.error(res, responseData);
        }
    },
    getAllDatingProfiles: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = user.sub;
        let reqObj = req.body;
        try {   
            let getProfileList = await datingDbHandler.getProfileDetailsByQuery({})
            if (!getProfileList.length) {
                responseData.msg = "Dating profile does not exist";
                return responseHelper.error(res, responseData);
            }
                responseData.msg = "Data Fetched Successfully !!!"; 
                responseData.data = getProfileList;
                return responseHelper.success(res, responseData);    
        } catch (error) {
            log.error('failed to fetch profiles with error::', error);
            responseData.msg = 'failed to fetch profiles';
            return responseHelper.error(res, responseData);
        }
    },

    getSingleProfileById: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = req.params.id;
        try {
            let getProfile = await datingDbHandler.getProfileDetailsById(id);
            if (!getProfile) {
                responseData.msg = "Dating profile does not exist";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Dating profile fetched successfully!!!";
            responseData.data = getProfile;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch dating profile with error::', error);
            responseData.msg = 'failed to fetch dating profile';
            return responseHelper.error(res, responseData);
        }
    },

    
    deleteDatingProfile: async (req, res) => {
        let responseData = {};
        let user = req.user;
        let id = req.params.id;
        try {
            let getProfile = await datingDbHandler.getProfileDetailsById(id);
            if(!getProfile){
                responseData.msg= 'No such profile exist in database';
                return responseHelper.error(res, responseData);
            }

            let deleteProfile= await datingDbHandler.deleteProfileById(id);
            responseData.msg = "Profile deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete dating profile with error::', error);
            responseData.msg = 'failed to delete dating profile';
            return responseHelper.error(res, responseData);
        }
    },


};