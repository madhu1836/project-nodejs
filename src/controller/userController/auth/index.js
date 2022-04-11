'use strict';
const logger = require('../../../services/logger');
const log = new logger('UserAuthController').getChildLogger();
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
/*******************
 * PRIVATE FUNCTIONS
 ********************/
/**
 * Method to Compare password
 */
let _comparePassword = (reqPassword, userPassword) => {
    return new Promise((resolve, reject) => {
        //compare password with bcrypt method, password and hashed password both are required
        bcrypt.compare(reqPassword, userPassword, function(err, isMatch) {
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
let _handleVerificationDataUpdate = async(id) => {
    log.info('Received request for deleting verification token::', id);
    let deletedInfo = await verificationDbHandler.deleteVerificationById(id);
    return deletedInfo;
};

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
/**************************
 * END OF PRIVATE FUNCTIONS
 **************************/
module.exports = {
    /**
     * Method to handle user login
     */
    login: async(req, res) => {
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
            if (!getUser[0].user_email_verified){
                responseData.msg = "Please verify your account!!!";
                return responseHelper.error(res, responseData);
            }
            
            let tokenData = {
                sub: getUser[0]._id,
                user_email: getUser[0].user_email,
            };
            let token = _generateUserToken(tokenData);
            let returnResponse = {
                user_id: getUser[0]._id,
                name: getUser[0].name,
                user_email: getUser[0].user_email,
                email_verify: getUser[0].user_email_verified,
                token: token
            }
            responseData.msg = `Welcome ${getUser[0].name} !!!`;
            responseData.data = returnResponse;
            return responseHelper.success(res, responseData);

        } catch (error) {
            log.error('failed to get user signup with error::', error);
            responseData.msg = 'failed to get user login';
            return responseHelper.error(res, responseData);
        }
    },
    /**
     * Method to handle user signup
     */
    signup: async(req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for User Signup:', reqObj);
        let responseData = {};
        console.log(reqObj);
        try {
            // let checkQuery = {
            //     $or: [
            //         { user_email: reqObj.user_email },
            //         { user_name: reqObj.user_name },
            //         { phone_number: reqObj.phone_number }
            //     ]
            // }
            let checkEmail = await userDbHandler.getUserDetailsByQuery({user_email: reqObj.user_email});
            let checkPhoneNumber = await userDbHandler.getUserDetailsByQuery({ phone_number: reqObj.phone_number });
            if (checkEmail.length) {
                responseData.msg = 'Email Already Exist !!!';
                return responseHelper.error(res, responseData);
            }
            if (checkPhoneNumber.length) {
                responseData.msg = 'Phone Number Already Exist !!!';
                return responseHelper.error(res, responseData);
            }
            
            let submitData = {
                name: reqObj.name,
                user_email: reqObj.user_email,
                phone_number: reqObj.phone_number,
                user_password:reqObj.user_password,
            }
            let newUser = await userDbHandler.createUser(submitData);
            log.info('User created in the database collection',newUser);
            //patch token data obj
            let tokenData = {
                user_email : newUser.user_email,
                name: newUser.name
            };
            let verificationType = 'email';
            //generate email verification token
            let emailVerificationToken = _generateVerificationToken(tokenData,verificationType);
            //send verification email after user successfully created
            //patch email verification templateBody
            let templateBody = {
                type: verificationType,
                token: emailVerificationToken,
                name: newUser.name
            };
            // console.log("token=======>", templateBody.token)
            let emailBody = {
                recipientsAddress: newUser.user_email,
                subject: 'A link to verify your email',
                body: templates.emailVerification(templateBody)
            };
            let emailInfo = await emailService.sendEmail(emailBody);
            if(emailInfo) {
                log.info('email verification mail sent successfully',emailInfo);
                let emailObj = {
                    token : emailVerificationToken,
                    user_id : newUser._id,
                    verification_type: verificationType
                };
                let newEmailVerification = await verificationDbHandler.createVerification(emailObj);
                log.info('new email verification entry created successfully in the database',newEmailVerification);
                responseData.msg = 'your account has been created successfully! Please verify your email. Verification link has been sent on your registered email Id';
                responseData.data = newEmailVerification
                // responseData.data = {token:mobileverificationtoken, type:'mobile'};
                return responseHelper.success(res,responseData);
            }
            // let saveData = await userDbHandler.createUser(reqObj);
            // responseData.msg = "Data Saved Successfully!!!";
            // return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to get user signup with error::', error);
            responseData.msg = 'failed to create user';
            return responseHelper.error(res, responseData);
        }
    },
    verifyEmail: async(req, res) => {
        let emailToken = req.decodedEmailToken;
        console.log("tokennnnn========================> ", emailToken)
        log.info('Received request for email verification ::', emailToken);
        let responseData = {};
        try {
            let query = {
                token: emailToken,
                verification_type: 'email'
            };
            let emailInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
            if (!emailInfo.length) {
                responseData.msg = 'Invalid email verification request or token expired';
                return responseHelper.error(res, responseData);
            }
            //update user email verification status
            let userId = emailInfo[0].user_id;
            let updateObj = {
                user_email_verified: true
            };
            let updatedUser = await userDbHandler.updateUserDetailsById(userId, updateObj);
            if (!updatedUser) {
                log.info('failed to verify user email');
                responseData.msg = 'failed to verify email';
                return responseHelper.error(res, responseData);
            }   
            log.info('user email verification status updated successfully', updatedUser);
            let removedTokenInfo = await _handleVerificationDataUpdate(emailInfo[0]._id);
            log.info('email verification token has been removed::', removedTokenInfo);
            responseData.msg = 'your email has been succesfully verified! Please login to continue';
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to process email verification::', error);
            responseData.msg = 'failed to verify user email';
            return responseHelper.error(res, responseData);
        }
    },
    
    /**
     * Method to handle forgot password by email
     */
     forgotPasswordByEmail: async(req, res) => {
        let reqBody = req.body;
        log.info('Recieved request for User forgot password:', reqBody);
        let userEmail = reqBody.user_email;
        let responseData = {};
        let isVerificationDataExists = false;
        try {
            let query = {
                user_email: userEmail,
                login_way: 'local'
            };
            let userData = await userDbHandler.getUserDetailsByQuery(query);
            if (!userData.length) {
                log.error('user email doesnot exist for forget password request');
                responseData.msg = 'User is not registered with us please register your self';
                return responseHelper.error(res, responseData);
            }
            let tokenData = {
                user_email: userData[0].user_email
            };
            let verificationType = 'email';
            //generate password verification token
            let passwordResetToken = _generateVerificationToken(tokenData, verificationType);
            //check if user already have forgot password request data in verification collection
            let passwordQuery = {
                user_id: userData[0]._id,
                verification_type: verificationType
            };
            let passwordTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(passwordQuery);
            let digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 4; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            //let OTP='1234';
            
            let otpBody = {
				otp: OTP
			};

            //if password verification data found update it with new token, else create new entry
            if (passwordTokenInfo.length) {
                isVerificationDataExists = true;
                let updatePasswordVerificationObj = {
                    token: passwordResetToken,
                    attempts: passwordTokenInfo[0].attempts + 1,
                    otp:otpBody.otp
                };
                let updateQuery = {
                    _id: passwordTokenInfo[0]._id,
                };
                let option = {
                    upsert: false
                };
                let updatedVerificationData = await verificationDbHandler.updateVerificationByQuery(updateQuery, updatePasswordVerificationObj, option);
                log.info('password verification token updated in the db', updatedVerificationData);
            }
            
            
            let emailBody = {
				recipientsAddress: userEmail,
				subject: 'OTP',
				body: templates.otpVerification(otpBody)
			};

            let emailInfo = await emailService.sendEmail(emailBody);
            
            
            //patch email verification templateBody
            let templateBody = {
                type: verificationType,
                token: passwordResetToken,
                otp: otpBody.otp
                
            };
            if (!isVerificationDataExists) {
                // if(emailInfo) {
            //     log.info('Email verification mail sent successfully',emailInfo);
            //     responseData.msg = 'OTP have been sent on the registered Email-Id';
            //     return responseHelper.success(res,responseData);
            // }
            // let emailInfo = await emailService.sendEmail(emailBody);
            // log.info('password reset mail sent successfully', emailInfo);
                let passwordResetObj = {
                    token: passwordResetToken,
                    user_id: userData[0]._id,
                    verification_type: verificationType,
                    otp: otpBody.otp
                };
                let newPasswordVerification = await verificationDbHandler.createVerification(passwordResetObj);
                log.info('new forgot password entry created successfully in the database', newPasswordVerification);
            }
            responseData.msg = 'Email validated and OTP is sent on your mail';
            responseData.data = templateBody;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to process forget password request with error::', error);
            responseData.msg = 'failed to process forget password request';
            return responseHelper.error(res, responseData);
        }
    },
    verifyOtp: async(req, res) => {
        let reQuery = req.query;
        let decodedEmailToken = reQuery.token;
        let reqBody = req.body;
        log.info('Received request for otp verification ::', decodedEmailToken);
        let responseData = {};
        try {
            let query = {
                token: decodedEmailToken,
                verification_type: 'email',
                otp: reqBody.otp
            };
            let verificationInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
            if (!verificationInfo.length) {
                responseData.msg = 'Invalid OTP';
                return responseHelper.error(res, responseData);
            }
            //update user email verification status
            let userId = verificationInfo[0].user_id;
            let updateObj = {
                user_email_verified: true
            };
            let updatedUser = await userDbHandler.updateUserDetailsById(userId, updateObj);
            if (!updatedUser) {
                log.info('failed to verify otp');
                responseData.msg = 'failed to verify otp';
                return responseHelper.error(res, responseData);
            }
            log.info('user email verification status updated successfully', updatedUser);
            verificationInfo[0].otp = "";
            let updatedVerificationInfo = await verificationInfo[0].save();
            // let removedTokenInfo = await _handleVerificationDataUpdate(mobileInfo[0]._id);
            // log.info('mobile verification token has been removed::',removedTokenInfo);
            responseData.msg = 'Otp verified verified successfully';
            responseData.data = { token: updatedVerificationInfo.token, type: updatedVerificationInfo.verification_type }
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to process email verification::', error);
            responseData.msg = 'failed to verify Otp';
            return responseHelper.error(res, responseData);
        }
    },
    resetPassword: async(req, res) => {
        let reQuery = req.query;
        let decodedEmailToken = reQuery.token;
        let reqBody = req.body;
        log.info('Recieved request for password reset====>:', decodedEmailToken, reqBody);
        let newPassword = reqBody.new_password;
        let responseData = {};
        try {
            let query = {
                token: decodedEmailToken,
                verification_type: 'email'
            };
            let passwordTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
            if (!passwordTokenInfo.length) {
                log.error('Invalid password reset token:', resetPasswordToken);
                responseData.msg = 'Invalid Password reset request or token expired';
                return responseHelper.error(res, responseData);
            }
            log.info("tokenInfo", passwordTokenInfo);
            let userId = passwordTokenInfo[0].user_id;
            let userDetail = await userDbHandler.getUserDetailsById(userId);
            // let comparePassword = await _comparePassword(newPassword, userDetail.user_password);
            // console.log("compare_password===>",comparePassword);
            // if (comparePassword) {
            //     log.error('Use old password:', newPassword);
            //     responseData.msg = 'new password can not be same as old password';
            //     return responseHelper.error(res, responseData);
            // }
            

            let encryptedPassword = await _encryptPassword(newPassword);
            let updateUserQuery = {
                user_password: encryptedPassword
            };
            let updatedUser = await userDbHandler.updateUserDetailsById(userId, updateUserQuery);
            if (!updatedUser) {
                log.error('failed to reset user password', updatedUser);
                responseData.msg = 'failed to reset password';
                return responseHelper.error(res, responseData);
            }
            //delete the password token from db;
            let removedTokenInfo = await _handleVerificationDataUpdate(passwordTokenInfo[0]._id);
            log.info('password verification token has been removed::', removedTokenInfo);
            responseData.msg = 'Password updated successfully! Please Login to continue';
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to reset password with error::', error);
            responseData.msg = 'failed to reset password';
            return responseHelper.error(res, responseData);
        }
    },
    
};