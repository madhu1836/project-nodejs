'use strict';
const jwtDecode = require('jsonwebtoken');
const responseHelper = require('../customResponse');
const config  = require('../../config/environments');
const logger = require('../logger');
const log = new logger('MiddlewareController').getChildLogger();
/***************************************************************
 * SERVICE FOR HANDLING EMAIL VERIFICATION TOKEN AUTHENTICATION
 **************************************************************/
module.exports = (req, res, next) => {
	/**
	 * Method to Authenticate Jwt email verification token
	 */
	let reqQuery = req.query;
	let verificationType = reqQuery.type;
	let token = reqQuery.token;
	let responseData = {};
	try {
		switch(verificationType) {
		case 'email': {
			log.info('Received request for validating email verification token',token);
			let decodedEmailToken = jwtDecode.verify(token,config.emailTokenInfo.secretKey);
			log.info('email verification token extracted successfully with data:',decodedEmailToken);
			req.decodedEmailToken = token;
			next();
			break;
		}
		case 'password': {
			log.info('Received request for validating password reset verification token',);
			let decodedPasswordToken = jwtDecode.verify(token,config.passwordResetTokenInfo.secretKey);
			log.info('password reset token extracted successfully with data:',decodedPasswordToken);
			req.decodedPasswordToken = token;
			next();
			break;
		}
		case 'mobile':
			log.info('Received request for validating password reset verification token',);
			let mobileTokenInfo = jwtDecode.verify(token,config.mobileTokenInfo.secretKey);
			log.info('password reset token extracted successfully with data:',mobileTokenInfo);
			req.mobileTokenInfo = token;
			next();
			break;
		default:
			responseData.msg = 'Invalid request';
			return responseHelper.error(res,responseData);
		}
	}catch(error) {
		log.error('failed to validate verification token with error::',error);
		if(error.TokenExpiredError) {
			responseData.msg = 'Token has been expired';
		}else {
			responseData.msg = 'failed to validate token request';
		}
		return responseHelper.error(res,responseData);
	}
};