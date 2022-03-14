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
            if (!getUser[0].user_otp_verified){
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
                user_otp_verified: getUser[0].user_otp_verified,
                gender: getUser[0].gender,
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
                gender: reqObj.gender,
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
            let digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 4; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            let otpBody = {
                otp: OTP,
                type: verificationType,
                token: emailVerificationToken,
            }

            let emailBody = {
				recipientsAddress: newUser.user_email,
				subject: 'OTP',
				body: templates.otpVerification(otpBody)
			};

            let emailInfo = await emailService.sendEmail(emailBody);
            if(emailInfo) {
                log.info('Email verification mail sent successfully',emailInfo);
                let emailObj = {
                    token : emailVerificationToken,
                    user_id : newUser._id,
                    verification_type: verificationType,
                    otp: OTP
                };
                log.info(emailObj)
                console.log('verification -----');
                let newEmailVerification = await verificationDbHandler.createVerification(emailObj);
                
                responseData.code = 200;
                responseData.msg = 'Your account has been created successfully!. To verify, You will receive an OTP on your registered email.';
                responseData.data = newEmailVerification
                return responseHelper.success(res,responseData);
            }
        } catch (error) {
            log.error('failed to get user signup with error::', error);
            responseData.msg = 'failed to create user';
            return responseHelper.error(res, responseData);
        }
    },
/**
 * Verify OTP After Signup
 */
 verifyOtpForPassword: async(req, res) => {
    let reQuery = req.query;
    let otpTokenInfo = reQuery.token;
    let reqBody = req.body;
    log.info('Received request for email verification ::', otpTokenInfo);
    let responseData = {};
    try {
        let query = {
            token: otpTokenInfo,
            verification_type: 'password',
            otp: reqBody.otp
        };
        let otpInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
        if (!otpInfo.length) {
            responseData.msg = 'Invalid email OTP verification request or token expired or wrong otp';
            return responseHelper.error(res, responseData);
        }
        //update user email verification status
        let userId = otpInfo[0].user_id;
        let updateObj = {
            user_otp_verified: true
        };
        let updatedUser = await userDbHandler.updateUserDetailsById(userId, updateObj);
        if (!updatedUser) {
            log.info('failed to verify user email');
            responseData.msg = 'failed to verify email';
            return responseHelper.error(res, responseData);
        }
        log.info('user email verification status updated successfully', updatedUser);
        // let removedTokenInfo = await _handleVerificationDataUpdate(otpInfo[0]._id);
        //     log.info('password verification token has been removed::', removedTokenInfo);
            responseData.msg = 'OTP verified successfully!';
            return responseHelper.success(res, responseData);
    } catch (error) {
        log.error('failed to process mobile verification::', error);
        responseData.msg = 'failed to verify user mobile';
        return responseHelper.error(res, responseData);
    }
},
    /**
     * Method to handle forgot password
     */
  forgotPassword: async (req,res) => {
    let reqBody = req.body;
    log.info('Recieved request for User forgot password:',reqBody);
    let userEmail = reqBody.user_email.toLowerCase();
    let responseData = {};
    let isVerificationDataExists = false;
    try {
        let query = {
            user_email : userEmail,
            login_way : 'local'
        };
        let userData = await userDbHandler.getUserDetailsByQuery(query);
        if(!userData.length) {
            log.error('user email does not exist for forgot password request');
            responseData.msg = 'Email Id doesn\'t exists';
            return responseHelper.error(res,responseData);
        }
        let tokenData = {
            user_email : userData[0].user_email
        };
        let verificationType = 'password';
        //generate password verification token
        let passwordResetToken = _generateVerificationToken(tokenData,verificationType);
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
        //if password verification data found update it with new token, else create new entry
        if(passwordTokenInfo.length) {
            isVerificationDataExists = true;
            let updatePasswordVerificationObj = {
                token : passwordResetToken,
                otp : OTP,
                attempts: passwordTokenInfo[0].attempts + 1
            };
            let updateQuery = {
                _id: passwordTokenInfo[0]._id,
            };
            let option = {
                upsert : false
            };
            let updatedVerificationData = await verificationDbHandler.updateVerificationByQuery(updateQuery,updatePasswordVerificationObj,option);
            log.info('password verification token updated in the db',updatedVerificationData);
        }
        //patch email verification templateBody
        let templateBody = {
            type: verificationType,
            otp : OTP,
            token: passwordResetToken
        };
        let emailBody = {
            recipientsAddress: userData[0].user_email,
            subject: 'OTP to change your password',
            body: templates.otpVerification(templateBody)
        };
        let emailInfo = await emailService.sendEmail(emailBody);
        if(emailInfo && !isVerificationDataExists) {
            log.info('password reset mail sent successfully',emailInfo);
            let passwordResetObj = {
                token : passwordResetToken,
                user_id : userData[0]._id,
                otp : OTP,
                verification_type: verificationType
            };
            let newPasswordVerification = await verificationDbHandler.createVerification(passwordResetObj);
            log.info('new forgot password entry created successfully in the database',newPasswordVerification);
            return responseHelper.success(res, responseData);
        }
        responseData.msg = 'OTP has been sent successfully fore forgot password! Please check your registered email inbox';
        responseData.data = { token: passwordResetToken, type: 'password' }
        return responseHelper.success(res,responseData);
    }catch(error) {
        log.error('failed to process forget password request with error::',error);
        responseData.msg = 'failed to process forget password request';
        return responseHelper.error(res,responseData);
    }
},    
    /**
     * Method to handle Reset Password
     */
     resetPassword: async(req, res) => {
        let reqBody = req.body;
        let resetPasswordToken = req.decodedPasswordToken;
        // let resetPasswordToken = req.params.token;
        log.info('Recieved request for password reset====>:', resetPasswordToken, reqBody);
        let newPassword = reqBody.new_password;
        let responseData = {};
        try {
            let query = {
                token: resetPasswordToken,
                verification_type: 'password'
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
            // if(userDetail.password) {
            //     let comparePassword = await _comparePassword(newPassword, userDetail.password);
            // }
            // let comparePassword = await _comparePassword(newPassword, userDetail.password);
            // console.log("compare_password===>",comparePassword);
            // if (comparePassword) {
            //     log.error('Use old password:', newPassword);
            //     responseData.msg = 'new password can not be same as old password';
            //     return responseHelper.error(res, responseData);
            // }
            
            if(!userDetail.user_otp_verified) {
                log.error('Please verify your OTP',userDetail[0].user_otp_verified);
                responseData.msg = 'Your OTP is not verified';
                return responseHelper.error(res,responseData);
            }

            let encryptedPassword = await _encryptPassword(newPassword);
            let updateUserQuery = {
                password: encryptedPassword,
                user_otp_verified : false
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

    verifyEmail: async (req, res) => {
        let emailToken = req.decodedEmailToken;
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
                responseData.msg = 'Invalid email verification request or token expired or wrong otp';
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
    
};