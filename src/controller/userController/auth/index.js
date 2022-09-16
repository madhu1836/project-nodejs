'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserAuthController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const userDbHandler = dbService.User;


/*******************
 * PRIVATE FUNCTIONS
 ********************/
/**
 * Method to Compare password
 */
let _comparePassword = (reqPassword, userPassword) => {
    return new Promise((resolve, reject) => {
        //compare password with bcrypt method, password and hashed password both are required
        bcrypt.compare(reqPassword, userPassword, function (err, isMatch) {
            if (err) reject(err);
            resolve(isMatch);
        });
    });
};
/**
 * Method to generate jwt token
 */
let _generateUserToken = (tokenData) => {
    //create a new instance for jwt service
    let tokenService = new jwtService();
    let token = tokenService.createJwtAuthenticationToken(tokenData);
    return token;
};
/**
 * Method to generate jwt token
 */
let _generateVerificationToken = (tokenData, verification_type) => {
    //create a new instance for jwt service
    let tokenService = new jwtService();
    let token = tokenService.createJwtVerificationToken(tokenData, verification_type);
    return token;
};
/**
 * Method to update user Email verification Database
 */
let _handleVerificationDataUpdate = async (id) => {
    log.info('Received request for deleting verification token::', id);
    let deletedInfo = await verificationDbHandler.deleteVerificationById(id);
    return deletedInfo;
};

let _encryptPassword = (password) => {
    let salt = config.bcrypt.saltValue;
    // generate a salt
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) reject(err);
            // hash the password with new salt
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) reject(err);
                // override the plain password with the hashed one
                resolve(hash);
            });
        });
    });
};
/**************************
 * END OF PRIVATE FUNCTIONS
 **************************/
module.exports = {

    /**
          * Method to handle user signup
          */
    signup: async (req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for User Signup:', reqObj);
        let responseData = {};
        console.log(reqObj);
        try {
            let checkEmail = await userDbHandler.getUserDetailsByQuery({ user_email: reqObj.user_email });
            if (checkEmail.length) {
                responseData.msg = 'Email Already Exist !!!';
                return responseHelper.error(res, responseData);
            }
            let checkPhoneNumber = await userDbHandler.getUserDetailsByQuery({ phone_number: reqObj.phone_number });
            if (checkPhoneNumber.length) {
                responseData.msg = 'Phone Number Already Exist !!!';
                return responseHelper.error(res, responseData);
            }

            let submitData = {
                first_name: reqObj.first_name,
                last_name: reqObj.last_name,
                phone_number: reqObj.phone_number,
                dob: reqObj.dob,
                user_email: reqObj.user_email,
                user_password: reqObj.user_password,
            }
            let newUser = await userDbHandler.createUser(submitData);
            log.info('User created in the database collection', newUser);
            responseData.msg = 'Your account has been created successfully!';
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to get user signup with error::', error);
            responseData.msg = 'failed to create user';
            return responseHelper.error(res, responseData);
        }
    },



    /**
     * Method to handle user login
     */
    login: async (req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for User Login:', reqObj);
        let responseData = {};
        try {
            let query = {
                user_email: reqObj.user_email
            }
            let getUser = await userDbHandler.getUserDetailsByQuery(query);
            if (!getUser.length) {
                responseData.msg = "Invalid Credentials!!!";
                return responseHelper.error(res, responseData);
            }

            let checkPassword = await _comparePassword(reqObj.user_password, getUser[0].user_password);
            if (!checkPassword) {
                responseData.msg = "Invalid Credentials!!!";
                return responseHelper.error(res, responseData);
            }

            let tokenData = {
                sub: getUser[0]._id,
                user_email: getUser[0].user_email,
            };
            let token = _generateUserToken(tokenData);
            let returnResponse = {
                user_id: getUser[0]._id,
                first_name: getUser[0].first_name,
                user_email: getUser[0].user_email,
                token: token,
            }
            responseData.msg = `Welcome ${getUser[0].first_name}!!`;
            responseData.data = returnResponse;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to get user Login with error::', error);
            responseData.msg = 'failed to get user login';
            return responseHelper.error(res, responseData);
        }
    },




    updateProfile: async (req, res) => {
        let reqObj = req.body;
        let id = req.user.sub
        log.info('Recieved request for Profile Update:', reqObj);
        let responseData = {};
        try {

            let getData = await userDbHandler.getUserDetailsById(id)
            if (!getData) {
                responseData.msg = 'Profile Does not Exist!';
                return responseHelper.error(res, responseData);
            }

            let UpdatedData = await userDbHandler.updateUserDetailsById(id, reqObj)
            responseData.data = 'Profile Update Successfully'
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to get Data with error::', error);
            responseData.msg = 'failed to get data';
            return responseHelper.error(res, responseData);
        }
    },


    getProfileById: async (req, res) => {
        let responseData = {};
        let id = req.user.sub;
        try {
            let getProfileData = await newsDbHandler.getUserDetailsById(id);
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




};