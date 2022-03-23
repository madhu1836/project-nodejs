'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminDatingController').getChildLogger();
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
        let id = req.query.id
        // console.log("ID===>",id);
        let reqObj = req.body;
        try {
            // let getProfileDetailsByQuery = await datingDbHandler.getProfileDetailsByQuery({user_id:{$ne: id}});
            // if (getProfileDetailsByQuery.length) {
            //     responseData.msg = "This dating profile already exist";
            //     return responseHelper.error(res, responseData);
            // }

            let filelocation = [];
            // console.log("========>", req.files)
            
            if (!req.file && !req.files.pictures) {
                responseData.msg = "Failed to upload pictures";
                return responseHelper.error(res, responseData);
        }

            if (req.files && req.files.pictures) {
                for (let i = 0; i < req.files.pictures.length; i++) {
                    filelocation.push(req.files.pictures[i].location);
                }
            }
            // let addressObj = {
			// 	city: reqObj.city,
            //     country: reqObj.country,
			// }
            // const response = {
			// 	address: addressObj
			// };
            // let coords = [+reqObj.longitude, +reqObj.latitude];
			// console.log("==========>",response);
            let Data = {
                pictures: filelocation,
                age: reqObj.age,
                height: reqObj.height,
                weight: reqObj.weight,
                looking_for: reqObj.looking_for,
                about: reqObj.about,
                // address: addressObj,
				// location: {
				// 	type: 'Point',
				// 	coordinates: coords,
                // },
                // user_id: id,
            }
            // let userProfile = await userDbHandler.getUserDetailsById(id)
            // if(!userProfile){
            //     responseData.msg = "User does not exist";
            //     return responseHelper.success(res, responseData);
            // }
            // if(userProfile.user_email != reqObj.profile_email){
            //     responseData.msg = "Email should be same as you profile email!!!";
            //     return responseHelper.success(res, responseData);
            // }
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
        let id = req.params.id;
        let reqObj = req.body;
        try {
            let getProfileDetailsByQuery = await datingDbHandler.getProfileDetailsByQuery({user_id: {$ne: id}});
            if (!getProfileDetailsByQuery.length) {
                responseData.msg = "Dating profile does not exist";
                return responseHelper.error(res, responseData);
            }

            let oldphotos = getProfileDetailsByQuery.pictures;
            oldphotos = [];
            let filelocation = [];
            if (req.files && req.files.pictures) {
                for (let i = 0; i < req.files.pictures.length; i++) {
                    filelocation.push(req.files.pictures[i].location);
                }
            }
            // let addressObj = {
			// 	city: reqObj.city,
            //     country: reqObj.country,
			// }
            // const response = {
			// 	address: addressObj
			// };
            let updateData = {
                pictures: filelocation,
                age: reqObj.age,
                height: reqObj.height,
                weight: reqObj.weight,
                looking_for: reqObj.looking_for,
                about: reqObj.about,
                // address: addressObj,
            }
            // let userProfile = await userDbHandler.getUserDetailsById(id)
            // if(!userProfile){
            //     responseData.msg = "User does not exist";
            //     return responseHelper.success(res, responseData);
            // }
            // if(userProfile.user_email != reqObj.profile_email){
            //     responseData.msg = "Email should be same as you profile email!!!";
            //     return responseHelper.success(res, responseData);
            // }
            let updatingData = await datingDbHandler.updateProfileDetailsById(id, updateData);
            // let updatedData = await datingDbHandler.getProfileDetailsByQuery({ profile_email: reqObj.profile_email })
            responseData.msg = "Dating profile updated successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update dating profile with error::', error);
            responseData.msg = "failed to update dating profile";
            return responseHelper.error(res, responseData);
        }
    },
    getDatingProfilesByFilter: async (req, res) => {
        let responseData = {};
        // let user = req.user;
        // let id = user.sub;
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
    getAllProfiles: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let id = admin.sub;
        try {
            let getProfileList = await datingDbHandler.getProfileDetailsByQuery({})
            if (!getProfileList.length) {
                responseData.msg = "No dating profile exists";
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
        let admin = req.admin;
        let id = req.params.id;
        try {
            let getProfile = await datingDbHandler.getProfileDetailsById(id);
            if (!getProfile) {
                responseData.msg = "Dating profiles does not exist";
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
    getAllProfilesByGender: async (req, res) => {
        let responseData = {};
        let admin = req.admin;
        let reqObj = req.body;
        try {
            
            let getProfileList = await datingDbHandler.getProfileDetailsByQuery({ gender: reqObj.gender })
            if (!getProfileList.length) {
                responseData.msg = "Dating profiles does not exist";
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