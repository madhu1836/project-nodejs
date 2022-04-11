'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminUserManagementController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
const jwtService = require('../../../services/jwt');
const emailService = require('../../../services/sendEmail');
const socialLoginService = require('../../../services/socialLogin');
const responseHelper = require('../../../services/customResponse');
const templates = require('../../../utils/templates/template');
const userDbHandler = dbService.User;
const verificationDbHandler = dbService.Verification;



let _encryptPassword = (password) => {
    let salt = config.bcrypt.saltValue;
    // generate a salt
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt, function(err, salt) {
            if (err) reject(err);
            // hash the password with new salt
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) reject(err);
                // override the plain password with the hashed one
                resolve(hash);
            });
        });
    });
};

module.exports = {
    /**
     * Method to handle add user
     */
    addUser: async(req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for add user:', reqObj);
        let responseData = {};
        console.log(reqObj);
        try {
            let checkEmail = await userDbHandler.getUserDetailsByQuery({user_email: reqObj.user_email});
            if (checkEmail.length) {
                responseData.msg = 'Email Already Exist !!!';
                return responseHelper.error(res, responseData);
            }
            // let checkPhoneNumber = await userDbHandler.getUserDetailsByQuery({ phone_number: reqObj.phone_number });
            // if (checkPhoneNumber.length) {
            //     responseData.msg = 'Phone Number Already Exist !!!';
            //     return responseHelper.error(res, responseData);
            // }
            // let checkUsername = await userDbHandler.getUserDetailsByQuery({ user_name: reqObj.user_name });
            //  if (checkUsername.length) {
            //      responseData.msg = 'User Name Already Exist !!!';
            //      return responseHelper.error(res, responseData);
            // }
            let submitData = {
                name: reqObj.name,
                user_email: reqObj.user_email,
                phone_number: reqObj.phone_number,
                // user_password:reqObj.user_password,
                gender: reqObj.gender,
                user_otp_verified: true,
            }
            console.log(submitData)
            let newUser = await userDbHandler.createUser(submitData);
            log.info('User created in the database collection',newUser);
            responseData.msg = "User created in the database collection!!!";
            return responseHelper.success(res, responseData);
            
        } catch (error) {
            log.error('failed to create user with error::', error);
            responseData.msg = 'failed to create user';
            return responseHelper.error(res, responseData);
        }
    },
    getAllUsers: async (req, res) => {
        let responseData = {};
        try {
            let getUserList = await userDbHandler.getUserDetailsByQuery({}, { user_password: 0 });
            if (!getUserList.length) {
                responseData.msg = "No user exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Data fetched successfully!!!";
            responseData.data = getUserList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getUserSearchSuggestions: async (req, res) => {
        let responseData = {};
        let reqObj = req.body;
        try {
            let getUserList = await userDbHandler.getUserDetailsByQuery({name: { $regex: ".*" + reqObj.name + ".*", $options: 'i' } }, { user_password: 0 });          
            responseData.msg = "Data fetched successfully!!!";
            responseData.data = getUserList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getUserSearchName: async (req, res) => {
        let responseData = {};
        let reqObj = req.body;
        try {
            let getUserList = await userDbHandler.getUserDetailsByQuery({name: reqObj.name  }, { user_password: 0 });
            if (!getUserList.length) {
                responseData.msg = "No user exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "Data fetched successfully!!!";
            responseData.data = getUserList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getSingleUser: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getUser = await userDbHandler.getUserDetailsById(id, { admin_password: 0 });
            if (!getUser) {
                responseData.msg = "No user exists";
                return responseHelper.error(res, responseData);
            }
            responseData.msg = "data fetched successfully!!!";
            responseData.data = getUser;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    updateUserProfile: async(req, res) => {
        let reqObj = req.body; 
        let id = req.params.id;
        log.info('Recieved request for User Profile update:', reqObj);
        let responseData = {};
        try {
            let userData = await userDbHandler.getUserDetailsById(id, {user_password: 0});
            if (!userData) {
                responseData.msg = 'Invalid user!!!';
                return responseHelper.error(res, responseData);
            }

            // let checkPhoneNumber = await userDbHandler.getUserDetailsByQuery({ phone_number: reqObj.phone_number });
            //  if (checkPhoneNumber.length && checkPhoneNumber[0]._id != id) {
            //      responseData.msg = 'Phone Number Already Exist !!!';
            //      return responseHelper.error(res, responseData);
            // }
            // let profile_picture = userData.profile_picture;
            // if (req.file) {
            //     profile_picture  = req.file.location;
            // }
            let updatedObj = {
                name: reqObj.name,
                user_email: reqObj.user_email,
                phone_number: reqObj.phone_number,
                // user_password:reqObj.user_password,
                gender: reqObj.gender,
            }
            if (reqObj.user_password) {
                updatedObj.user_password = await _encryptPassword(reqObj.user_password);
            }
            let updateProfile = await userDbHandler.updateUserDetailsById(id, updatedObj);
            responseData.msg = `Data updated sucessfully !!!`;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to Update User with error::', error);
            responseData.msg = 'failed to Update User';
            return responseHelper.error(res, responseData);
        }
    },
    deleteUserProfile: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getUser = await userDbHandler.getUserDetailsById(id);
            if(!getUser){
                responseData.msg= "No such user profile exists";
                return responseHelper.error(res, responseData);
            }
            let deleteUserProfile = await userDbHandler.deleteUserById(id);
            responseData.msg = "User profile deleted successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to delete user profile with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },


}