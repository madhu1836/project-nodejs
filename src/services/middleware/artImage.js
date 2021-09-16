'use strict';
const jwtDecode = require('jsonwebtoken');
const responseHelper = require('../customResponse');
const config  = require('../../config/environments');
const logger = require('../logger');
const log = new logger('MiddlewareController').getChildLogger();
/***************************************************************
 * SERVICE FOR HANDLING ART UPLOAD TOKEN AUTHENTICATION
 **************************************************************/
module.exports = (req, res, next) => {
	/**
	 * Method to Authenticate Art token
	 */
	let reqBody = req.body;
	let artDataToken = reqBody.art_data;
	let responseData = {};
	try {
		log.info('Received request for validating art image upload token',artDataToken);
		let decodedToken = jwtDecode.verify(artDataToken,config.emailTokenInfo.secretKey);
		log.info('art Image upload token extracted successfully with data:',decodedToken);
		req.artImgUploadToken = artDataToken;
		next();
	}catch(error) {
		log.error('failed to validate art image upload token with error::',error);
		if(error.TokenExpiredError) {
			responseData.msg = 'Token has been expired';
		}else {
			responseData.msg = 'failed to validate token request';
		}
		return responseHelper.error(res,responseData);
	}
};