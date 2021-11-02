'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminCategoryController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const userDbHandler = dbService.User
const datingDbHandler = dbService.DatingProfile;
const config = require('../../../config/environments');


module.exports={
    createDatingProfile: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        // let id = admin.sub;
        let id = req.params.id
        // console.log("ID===>",id);
        let reqObj = req.body;
        try {
            let getProfileDetailsByQuery = await datingDbHandler.getProfileDetailsByQuery({ profile_email: reqObj.profile_email });
            if (getProfileDetailsByQuery.length) {
                responseData.msg = "This dating profile already exist";
                return responseHelper.error(res, responseData);
            }

            let fileLocation = '';

            if (req.file) {
                fileLocation = req.file.location;
            }
            let Data = {
                profile_image: fileLocation,
                name: reqObj.name,
                bio: reqObj.bio,
                gender: reqObj.gender,
                profile_email : reqObj.profile_email
            }
            let userProfile = await userDbHandler.getUserDetailsById(id)
            if(userProfile.user_email != reqObj.profile_email){
                responseData.msg = "Email should be same as you profile email!!!";
                return responseHelper.success(res, responseData);
            }

            let newProfile = await datingDbHandler.createProfile(Data);
            responseData.msg = "Dating profile created successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to create dating profile with error::', error);
            responseData.msg = "failed to create dating profile";
            return responseHelper.error(res, responseData);
        }
    },
    updateDatingProfile: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = admin.sub;
        // let id = admin.sub;
        // console.log("ID===>", id);
        let reqObj = req.body;
        try {
            let getProfileDetailsByQuery = await datingDbHandler.getProfileDetailsByQuery({ profile_email: reqObj.profile_email });
            if (!getProfileDetailsByQuery) {
                responseData.msg = "Dating profile does not exist";
                return responseHelper.error(res, responseData);
            }

            let fileLocation = '';

            if (req.file) {
                fileLocation = req.file.location;
            }

            let updateData = {
                profile_image: fileLocation,
                name: reqObj.name,
                bio: reqObj.bio,
                profile_email : reqObj.profile_email,
                gender: reqObj.gender
            }
            // let userProfile = await userDbHandler.getUserDetailsById(id)
            // if(userProfile.user_email != reqObj.profile_email){
            //     responseData.msg = "Email should be same as you profile email!!!";
            //     return responseHelper.success(res, responseData);
            // }

            let updatingData = await datingDbHandler.updateProfileByQuery( {profile_email: reqObj.profile_email}, updateData);
            let updatedData = await datingDbHandler.getProfileDetailsByQuery({ profile_email: reqObj.profile_email })
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
        let admin = req.admin;
        let id = admin.sub;
        try {
            let getProfileList = await datingDbHandler.getProfileDetailsByQuery({})
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
        let admin = req.admin;
        let id = req.params.id;
        try {
            let getProfile = await datingDbHandler.getProfileDetailsById(id);
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
        let admin = req.admin;
        let id =req.params.id
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