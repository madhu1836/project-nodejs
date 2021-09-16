'use strict';
const logger = require('../../../services/logger');
const log = new logger('userDriverController').getChildLogger();
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
			if (!req.file) {
				responseData.msg = 'Please upload resume!!!';
				return responseHelper.error(res,responseData);
			}
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
				location: reqObj.location
			}
			let saveData = await driverDbHandler.createDriver(submitObject);
			responseData.msg = 'Thank you for registering with us we will contact you soon!!!';
			return responseHelper.success(res, responseData);
		}
		catch(error) {
			log.error('failed to get user signup with error::',error);
			responseData.msg = 'failed to save data';
			return responseHelper.error(res,responseData);
		}
	},

	get_driver: async (req, res) => {
		let user = req.user;
		log.info("Request recieve for get user", user);
		let user_id = user.sub;
		let responseData = {};
		try {
			let driverData = await driverDbHandler.getDriverDetailsById(user_id, {password: 0});
			responseData.msg = "Data fetched successfully!!!";
			responseData.data = driverData;
			return responseHelper.success(res, responseData);
		} catch (error) {
			log.error('failed to get user signup with error::',error);
			responseData.msg = 'failed to save data';
			return responseHelper.error(res,responseData);
		}
	},
	driver_login: async (req, res) => {
		let reqObj = req.body;
		log.info('Recieved request for Driver Login:',reqObj);
		let responseData = {};
		try {
			let query = {
				email: reqObj.email,
				login_way: 'local'
			};
			//check if user email is present in the database, then only login request will process
			let userData = await driverDbHandler.getDriverDetailsByQuery(query)
			//if no user found, return error
			if (!userData.length) {
				responseData.msg = 'Email Id is not registered, please register yourself!';
				return responseHelper.error(res, responseData);
			}
			let reqPassword = reqObj.password;
			let userPassword = userData[0].password;
			//compare req body password and user password,
			let isPasswordMatch = await _comparePassword(reqPassword, userPassword);
			//if password does not match, return error
			if (!isPasswordMatch) {
				responseData.msg = 'Incorrect Password!';
				return responseHelper.error(res, responseData);
			}
			//check if user email Id is verified or not
			// if (!userData[0].email_verified) {
			// 	responseData.msg = 'email Id not verified, please register again and verify your email id';
			// 	responseData.data = {
			// 		user_email_verified: userData[0].user_email_verified,
			// 		user_email: userData[0].user_email
			// 	};
			// 	return responseHelper.error(res, responseData);
			// }
			//check authorization
			/*if (!userData[0].isAuthorised && !userData[0].user_role != 'patient') {
				responseData.msg = 'You are not authorised to login';
				return responseHelper.error(res, responseData);
			}*/
			//patch token data obj
			let tokenData = {
				first_name: userData[0].first_name,
				last_name: userData[0].last_name,
				sub: userData[0]._id,
				email: userData[0].email,
			};
			//generate jwt token with the token obj
			let jwtToken = _generateUserToken(tokenData);
			log.info('Driver login found', userData);
			//update the response Data
			responseData.msg = `Welcome ${userData[0].first_name}`;
			responseData.data = {
				authToken: jwtToken,
				email: userData[0].email,
				avatar: userData[0].avatar,
				first_name: userData[0].first_name,
				last_name: userData[0].last_name,
				driver_id: userData[0]._id
			};
			return responseHelper.success(res, responseData);
		} catch (error) {
			log.error('failed to get login with error::',error);
			responseData.msg = 'failed to login driver';
			return responseHelper.error(res,responseData);
		}
	}
	
};
