'use strict';
const logger = require('../../../services/logger');
const log = new logger('adminDriverController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
const jwtService = require('../../../services/jwt');
const emailService = require('../../../services/sendEmail');
const socialLoginService = require('../../../services/socialLogin');
const responseHelper = require('../../../services/customResponse');
const templates = require('../../../utils/templates/template');
const verificationDbHandler = dbService.Verification;
const driverDbHandler = dbService.Driver;
/*******************
 * PRIVATE FUNCTIONS
 ********************/
/**
 * Method to Compare password
 */
let _comparePassword = (reqPassword,userPassword) => {
	return new Promise((resolve,reject)=>{
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
let _generateVerificationToken = (tokenData,verification_type) => {
	//create a new instance for jwt service
	let tokenService = new jwtService();
	let token = tokenService.createJwtVerificationToken(tokenData,verification_type);
	return token;
};
/**
 * Method to update user Email verification Database
 */
let _handleVerificationDataUpdate = async (id) => {
	log.info('Received request for deleting verification token::',id);
	let deletedInfo = await verificationDbHandler.deleteVerificationById(id);
	return deletedInfo;
};

let _encryptPassword = (password) => {
	let salt = config.bcrypt.saltValue;
	// generate a salt
	return new Promise((resolve,reject)=>{
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
	* Method to handle save driver
	*/
	save_driver: async (req,res) => {
		let reqObj = req.body;
		log.info('Recieved request for User Login:',reqObj);
		let responseData = {};
		try {
			// if (!req.file) {
			// 	responseData.msg = 'Please upload resume!!!';
			// 	return responseHelper.error(res,responseData);
			// }
			let checkEmail = await driverDbHandler.getDriverDetailsByQuery({email: reqObj.email});
			let checkPhone = await driverDbHandler.getDriverDetailsByQuery({phone_number: reqObj.phone_number});
			if (checkEmail.length) {
				responseData.msg = 'Email already exist!!!';
				return responseHelper.error(res,responseData);
			}
			if (checkPhone.length) {
				responseData.msg = 'Phone number already exist!!!';
				return responseHelper.error(res,responseData);
			}
			let addressObj = {
				mailing_address: reqObj.mailing_address,
				street: reqObj.street,
				street2: reqObj.street2,
				city: reqObj.city,
				state: reqObj.state,
				zip: reqObj.zip,
			}
			// let locationObj = {
			// 	location: reqObj.location
			// }
			let submitObject = {
				first_name: reqObj.first_name,
				last_name: reqObj.last_name,
				area_code: reqObj.area_code,
				phone_number: reqObj.phone_number,
				email: reqObj.email,
				prefer_start_date: reqObj.prefer_start_date,
				resume: req.file.location,
				address: addressObj,
				location: reqObj.location,
                password: reqObj.password
			}

			if (req.is_verify) {
				submitObject.is_verify = req.is_verified;
			}
			let saveData = await driverDbHandler.createDriver(submitObject);
			responseData.msg = 'Data Saved Successfully!!!';
			return responseHelper.success(res, responseData);
		}
		catch(error) {
			log.error('failed to save data with error::',error);
			responseData.msg = 'failed to save data';
			return responseHelper.error(res,responseData);
		}
	},
    /**
     * Method to get all drivers
     */
    get_all_driver: async (req, res) => {
        let responseData = {};
        try {
            let getAllDrivers = await driverDbHandler.getDriverDetailsByQuery({});
            responseData.msg = "Data Fetched Successfully!!!";
            responseData.data = getAllDrivers;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::',error);
			responseData.msg = 'failed to fetch data';
			return responseHelper.error(res,responseData);
        }
    },

    /**
     * Method to get single driver
     */
     get_single_driver: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getAllDrivers = await driverDbHandler.getDriverDetailsById(id);
            responseData.msg = "Data Fetch Successfully!!!";
            responseData.data = getAllDrivers;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::',error);
			responseData.msg = 'failed to fetch data';
			return responseHelper.error(res,responseData);
        }
    },

    /**
	* Method to handle update driver
	*/
	update_driver: async (req,res) => {
		let reqObj = req.body;
        let id = req.params.id;
		log.info('Recieved request for User Login:',reqObj);
		let responseData = {};
		try {
			// if (!req.file) {
			// 	responseData.msg = 'Please upload resume!!!';
			// 	return responseHelper.error(res,responseData);
			// }
			let checkEmail = await driverDbHandler.getDriverDetailsByQuery({email: reqObj.email});
			let checkPhone = await driverDbHandler.getDriverDetailsByQuery({phone_number: reqObj.phone_number});
            // console.log("currenId====>", checkEmail[0].id);
            // console.log("ReqId====>", id);
			if (checkEmail.length && checkEmail[0].id != id) {
				responseData.msg = 'Email already exist!!!';
				return responseHelper.error(res,responseData);
			}
			if (checkPhone.length && checkEmail[0].id != id) {
				responseData.msg = 'Phone number already exist!!!';
				return responseHelper.error(res,responseData);
			}
			let addressObj = {
				mailing_address: reqObj.mailing_address,
				street: reqObj.street,
				street2: reqObj.street2,
				city: reqObj.city,
				state: reqObj.state,
				zip: reqObj.zip,
			}
			let submitObject = {
				first_name: reqObj.first_name,
				last_name: reqObj.last_name,
				area_code: reqObj.area_code,
				phone_number: reqObj.phone_number,
				email: reqObj.email, 
				prefer_start_date: reqObj.prefer_start_date,
				address: addressObj,
				location: reqObj.location,
                is_verify: reqObj.is_verify
			}
			let reqPassword = await _encryptPassword(reqObj.password);
			console.log("ReqPass========>", reqObj.password);
            if (reqObj.password) {
				console.log("Req========>", reqPassword);
                submitObject.password = reqPassword;
            }
            if (req.file) {
                submitObject.resume = req.file.location;
            }
			if (req.is_verify) {
				submitObject.is_verify = req.is_verified;
			}
			let updateData = await driverDbHandler.updateDriverDetailsById(id, submitObject);
			responseData.msg = 'Data updated Successfully!!!';
			return responseHelper.success(res, responseData);
		}
		catch(error) {
			log.error('failed to update data with error::',error);
			responseData.msg = 'failed to update data';
			return responseHelper.error(res,responseData);
		}
	},
	
};
