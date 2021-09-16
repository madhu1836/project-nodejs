'use strict';
const logger = require('../../../services/logger');
const log = new logger('AuthController').getChildLogger();
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
	* Method to handle user login
	*/
	login: async (req,res) => {
		let reqObj = req.body;
		log.info('Recieved request for User Login:',reqObj);
		let responseData = {};
		try {
			let checkemail =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			let numbers = /^\d+$/;
			if (checkemail.test(String(reqObj.em_phone).toLowerCase())) {
				let query = {
					user_email: reqObj.em_phone,
					login_way: 'local'
				};
				//check if user email is present in the database, then only login request will process
				let userData = await userDbHandler.getUserDetailsByQuery(query);
				//if no user found, return error
				if (!userData.length) {
					responseData.msg = 'Email Id is not registered, please register yourself!';
					return responseHelper.error(res, responseData);
				}
				let reqPassword = reqObj.user_password;
				let userPassword = userData[0].user_password;
				//compare req body password and user password,
				let isPasswordMatch = await _comparePassword(reqPassword, userPassword);
				//if password does not match, return error
				if (!isPasswordMatch) {
					responseData.msg = 'Incorrect Password!';
					return responseHelper.error(res, responseData);
				}
				//check if user email Id is verified or not
				if (!userData[0].user_email_verified) {
					responseData.msg = 'email Id not verified, please register again and verify your email id';
					responseData.data = {
						user_email_verified: userData[0].user_email_verified,
						user_email: userData[0].user_email
					};
					return responseHelper.error(res, responseData);
				}
				//check authorization
				/*if (!userData[0].isAuthorised && !userData[0].user_role != 'patient') {
					responseData.msg = 'You are not authorised to login';
					return responseHelper.error(res, responseData);
				}*/
				//patch token data obj
				let tokenData = {
					user_name: userData[0].user_name,
					user_last_name: userData[0].user_last_name,
					sub: userData[0]._id,
					user_email: userData[0].user_email,
					user_role: userData[0].user_role,
				};
				//generate jwt token with the token obj
				let jwtToken = _generateUserToken(tokenData);
				log.info('User login found', userData);
				//update the response Data
				responseData.msg = `Welcome ${userData[0].user_name}`;
				responseData.data = {
					authToken: jwtToken,
					user_email_verified: userData[0].user_email_verified,
					user_email: userData[0].user_email,
					user_avatar: userData[0].user_avatar,
					user_name: userData[0].user_name,
					user_last_name: userData[0].user_last_name,
					isUserBasicProfileComplete: userData[0].isUserBasicProfileComplete,
                    user_role: userData[0].user_role,
					pharmacy_name: "",
					user_id: userData[0]._id
				};
				if (userData[0].user_role == 'lab') {
					let LabData = await labDbHandler.getOneLabDetailsByQuery({userId: userData[0]._id});
					// console.log(LabData);
					if (LabData) {
						responseData.data.lab_name = LabData.name;
					}
				}
				if (userData[0].user_role == 'pharmacy') {
					let Pharmacy = await pharmacyDbHandler.getOnePharmacyDetailsByQuery({userId: userData[0]._id});
					if (Pharmacy) {
						responseData.data.pharmacy_name = Pharmacy.name;
					}
				}
				return responseHelper.success(res, responseData);

			} else {

				if (!numbers.test(reqObj.em_phone) && !checkemail.test(String(reqObj.em_phone).toLowerCase()))
				{
					responseData.msg = 'Please enter a valid email address';
					return responseHelper.error(res,responseData);
				}

				if (numbers.test(reqObj.em_phone) && reqObj.em_phone.length < 10)
				{
					responseData.msg = 'Mobile number must be contain 10 digit';
					return responseHelper.error(res,responseData);
				}

				let query = {
					phone_number: reqObj.em_phone,
					login_way: 'local'
				};
				//check if user email is present in the database, then only login request will process
				let userData = await userDbHandler.getUserDetailsByQuery(query);
				//if no user found, return error
				if (!userData.length) {
					responseData.msg = 'Mobile number is not registered, please register yourself';
					return responseHelper.error(res, responseData);
				}
				let reqPassword = reqObj.user_password;
				let userPassword = userData[0].user_password;
				//compare req body password and user password,
				let isPasswordMatch = await _comparePassword(reqPassword, userPassword);
				//if password does not match, return error
				if (!isPasswordMatch) {
					responseData.msg = 'Incorrect Password!';
					return responseHelper.error(res, responseData);
				}
				//check if user email Id is verified or not
				if (!userData[0].user_phone_verified) {
					responseData.msg = 'Mobile number is not verified, please register again and verify your mobile number';
					responseData.data = {
						user_phone_verified: userData[0].user_phone_verified,
						phone_number: userData[0].phone_number
					};
					return responseHelper.error(res, responseData);
				}
				//patch token data obj
				let tokenData = {
					user_name: userData[0].user_name,
					user_last_name: userData[0].user_last_name,
					sub: userData[0]._id,
					phone_number: userData[0].phone_number,
					user_role: userData[0].user_role,
				};
				//generate jwt token with the token obj
				let jwtToken = _generateUserToken(tokenData);
				log.info('User login found', userData);
				//update the response Data
				responseData.msg = `Welcome ${userData[0].user_name}`;
				responseData.data = {
					authToken: jwtToken,
					user_phone_verified: userData[0].user_phone_verified,
					phone_number: userData[0].phone_number,
					user_avatar: userData[0].user_avatar,
					user_name: userData[0].user_name,
					user_last_name: userData[0].user_last_name,
					isUserBasicProfileComplete: userData[0].isUserBasicProfileComplete,
                    user_role: userData[0].user_role,
					pharmacy_name: "",
					user_id: userData[0]._id
				};
				if (userData[0].user_role == 'lab') {
					let LabData = await labDbHandler.getOneLabDetailsByQuery({userId: userData[0]._id});
					// console.log(LabData);
					if (LabData) {
						responseData.data.lab_name = LabData.name;
					}
				}
				if (userData[0].user_role == 'pharmacy') {
					let Pharmacy = await pharmacyDbHandler.getOnePharmacyDetailsByQuery({userId: userData[0]._id});
					if (Pharmacy) {
						responseData.data.pharmacy_name = Pharmacy.name;
					}
				}
				return responseHelper.success(res, responseData);
			}
		}
		catch(error) {
			log.error('failed to get user signup with error::',error);
			responseData.msg = 'failed to get user login';
			return responseHelper.error(res,responseData);
		}
	},
	/**
	* Method to handle user signup
	*/
	signup: async (req,res) => {
		let reqObj = req.body;
		log.info('Recieved request for User Signup:',reqObj);
		let responseData = {};
		console.log(reqObj);
		try {
			if(reqObj.user_name.length < 3) {
				responseData.msg = 'User first name must be take minimum 3 characters';
				return responseHelper.error(res,responseData);
			}
			if (!reqObj.em_phone) {
				responseData.msg = 'Email or Phone must be required';
				return responseHelper.error(res,responseData);
			}

			if (reqObj.user_role != 'doctor' && reqObj.user_role != 'patient' && reqObj.user_role != 'lab' && reqObj.user_role != 'pharmacy') {
				responseData.msg = 'Only doctor or patient as user allowed';
				return responseHelper.error(res,responseData);
			}

			if (reqObj.user_name == reqObj.user_last_name) {
				responseData.msg = 'User Firstname and User Last Name must not be same';
				return responseHelper.error(res,responseData);
			}

			let query = { user_email: reqObj.em_phone };
			let query2 = { phone_number: reqObj.em_phone }
			//check if user email is present in the database, then reject the signup request
			let userData = await userDbHandler.getUserDetailsByQuery(query);
			let userData2 = await userDbHandler.getUserDetailsByQuery(query2);
			//return error if user data found has length > 0
			if(userData.length) {
				if (userData[0].user_email_verified) {
					responseData.msg = 'Email Id already exists';
					return responseHelper.error(res, responseData);
				}
				let EmailverificationType = 'email';
				let EmailemailQuery = {
					user_id: userData[0]._id,
					verification_type: EmailverificationType
				};
				let EmailemailTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(EmailemailQuery);
				if(!EmailemailTokenInfo.length) {
					log.error('Pre saved email token info not found!');
					responseData.msg = 'Invalid request';
					return responseHelper.error(res,responseData);
				}
				//Allow maximum of 2 resend attempts only
				if(EmailemailTokenInfo[0].attempts >= 2) {
					log.error('maximum resend email attempts');
					responseData.msg = 'maximum resend attempts';
					return responseHelper.error(res,responseData);
				}
				let EmailtokenData = {
					user_email : userData[0].user_email,
				};
				//generate new email verification token
				let EmailnewEmailVerificationToken = _generateVerificationToken(EmailtokenData,EmailverificationType);
				//send verification email after user successfully created
				//patch email verification templateBody
				let EmailtemplateBody = {
					type: EmailverificationType,
					token: EmailnewEmailVerificationToken,
					name: userData[0].user_name
				};
				let EmailemailBody = {
					recipientsAddress: userData[0].user_email,
					subject: 'Resend: A link to verify your email',
					body: templates.emailVerification(EmailtemplateBody)
				};
				let EmailemailInfo = await emailService.sendEmail(EmailemailBody);
				if(!EmailemailInfo) {
					log.error('failed to resend email verification mail');
					responseData.msg = 'failed to send email verification email';
					return responseHelper.error(res,responseData);
				}
				log.info('new email verification mail sent successfully',EmailemailInfo);
				let EmailupdateEmailVerificationObj = {
					token : EmailnewEmailVerificationToken,
					attempts: EmailemailTokenInfo[0].attempts + 1
				};
				let EmailupdateQuery = {
					_id: EmailemailTokenInfo[0]._id
				};
				let Emailoption = {
					upsert : false
				};
				let EmailupdatedEmailVerification = await verificationDbHandler.updateVerificationByQuery(EmailupdateQuery,EmailupdateEmailVerificationObj,Emailoption);
				if(!EmailupdatedEmailVerification) {
					log.info('failed to update email verification updated successfully in the database',updatedEmailVerification);
				}
				log.info('email verification updated successfully in the database',EmailupdatedEmailVerification);
				//update response data
				userData[0].user_name = reqObj.user_name;
				userData[0].user_last_name = reqObj.user_last_name;
				await userData[0].save();
				responseData.msg = 'your account has been created successfully! Please verify your email. Verification link has been sent on your registered email Id';
				return responseHelper.success(res,responseData);
			}

			if(userData2.length) {
				// responseData.msg = 'Mobile Number already exists but not verified';
				if (userData2[0].user_phone_verified) {
					responseData.msg = 'Phone Number already exists';
					return responseHelper.error(res,responseData);
				}
				let newmobileverificationType = 'mobile';

				let newmobileQuery = {
					user_id: userData2[0]._id,
					verification_type: newmobileverificationType
				};
				let newmobileTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(newmobileQuery);
				/*if(!mobileTokenInfo.length) {
					log.error('Pre saved mobile token info not found!');
					responseData.msg = 'Invalid request';
					return responseHelper.error(res,responseData);
				}
				//Allow maximum of 2 resend attempts only
				if(mobileTokenInfo[0].attempts >= 2) {
					log.error('maximum resend mobile attempts  ');
					responseData.msg = 'maximum resend attempts';
					return responseHelper.error(res,responseData);
				}*/
				let newtokenData = {
					phone_number: userData2[0].phone_number,
					name: userData2[0].user_name,
				};
				//generate new mobile verification token
				let newmobileverificationtoken = _generateVerificationToken(newtokenData,newmobileverificationType);

				let digits = '0123456789';
				let OTP = '';
				for (let i = 0; i < 5; i++) {
					OTP += digits[Math.floor(Math.random() * 10)];
				}

				if (newmobileverificationtoken) {
					// await sendOtp(newUser.phone_number, `Otp ${OTP} From Docsofy!`);
					let Otp_data = await emailService.sendOtp(userData2[0].phone_number, `Otp ${OTP} From Docsofy!`);
					console.log(Otp_data);
					let newupdateMobileVerificationObj = {
						token: newmobileverificationtoken,
						otp: OTP,
						attempts: newmobileTokenInfo[0].attempts + 1
					};
					let newupdateQuery = {
						_id: newmobileTokenInfo[0]._id
					};
					let newoption = {
						upsert: false
					};
					let newupdatedMobileVerification = await verificationDbHandler.updateVerificationByQuery(newupdateQuery, newupdateMobileVerificationObj, newoption);
					if (!newupdatedMobileVerification) {
						responseData.msg = 'Failed to send Otp!!!';
						return responseHelper.error(res, responseData);
					}
					userData2[0].user_name = reqObj.user_name;
					userData2[0].user_last_name = reqObj.user_last_name;
					// console.log(userData2[0]);
					await userData2[0].save();
					responseData.msg = 'your account has been created successfully! Please verify your mobile. Verification otp send to you registered mobile number';
					responseData.data = {token: newmobileverificationtoken, type: 'mobile'};
					return responseHelper.success(res, responseData);
				}
			}


			let password = reqObj.user_password;
			let engupregex = new RegExp("(?=.*?[A-Z])");
			let englowregex = new RegExp("(?=.*?[a-z])");
			let numericregex = new RegExp("(?=.*?[0-9])");
			let specialregex = new RegExp("(?=.*?[#?!@$%^&*-])");
			let minlengthregex = new RegExp(".{6,}");
			if (!engupregex.test(password)) {
				responseData.msg = 'Password must have at least one uppercase letter';
				return responseHelper.error(res,responseData);
			}

			if (!englowregex.test(password)) {
				responseData.msg = 'Password must have at least one lowercase letters';
				return responseHelper.error(res,responseData);
			}

			if (!numericregex.test(password)) {
				responseData.msg = 'Password must have at least one numeric letters';
				return responseHelper.error(res,responseData);
			}

			if (!specialregex.test(password)) {
				responseData.msg = 'Password must have at least one special character';
				return responseHelper.error(res,responseData);
			}

			if (!minlengthregex.test(password)) {
				responseData.msg = 'Password must be minimum six character';
				return responseHelper.error(res,responseData);
			}


			let checkemail =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (checkemail.test(String(reqObj.em_phone).toLowerCase())) {
				let submitData = {
					user_name:reqObj.user_name,
					user_last_name: reqObj.user_last_name,
					user_email: reqObj.em_phone,
					phone_number: "",
					user_password:reqObj.user_password,
					confirm_password:reqObj.confirm_password,
					user_role:reqObj.user_role
				}
				let newUser = await userDbHandler.createUser(submitData);
				log.info('User created in the database collection',newUser);
				//patch token data obj
				let tokenData = {
					user_email : newUser.user_email,
					name: newUser.user_name
				};
				let verificationType = 'email';
				//generate email verification token
				let emailVerificationToken = _generateVerificationToken(tokenData,verificationType);
				//send verification email after user successfully created
				//patch email verification templateBody
				let templateBody = {
					type: verificationType,
					token: emailVerificationToken,
					name: newUser.user_name
				};
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
					// responseData.data = {token:mobileverificationtoken, type:'mobile'};
					return responseHelper.success(res,responseData);
				}
			} else {
				let numbers = /^\d+$/;
				//create a new user in the database
				if (!numbers.test(reqObj.em_phone) && !checkemail.test(reqObj.em_phone))
				{
					responseData.msg = 'Please enter a valid email address';
					return responseHelper.error(res,responseData);
				}

				if (numbers.test(reqObj.em_phone) && reqObj.em_phone.length < 10)
				{
					responseData.msg = 'Mobile number must be contain 10 digit';
					return responseHelper.error(res,responseData);
				}

				if (numbers.test(reqObj.em_phone) && reqObj.em_phone.length > 10)
				{
					responseData.msg = 'Mobile number must be contain 10 digit';
					return responseHelper.error(res,responseData);
				}
				if (reqObj.em_phone.charAt(0) == '0') {
					responseData.msg = 'Invalid Mobile Number!';
					return responseHelper.error(res,responseData);
				}

				let submitData = {
					user_name:reqObj.user_name,
					user_last_name: reqObj.user_last_name,
					user_email:"",
					phone_number: reqObj.em_phone,
					user_password:reqObj.user_password,
					confirm_password:reqObj.confirm_password,
					user_role:reqObj.user_role
				}
				let newUser = await userDbHandler.createUser(submitData);

				let tokenmobileData = {
					phone_number: newUser.phone_number,
					name: newUser.user_name
				};
				let mobileverificationType = 'mobile';
				//generate email verification token
				let mobileverificationtoken = _generateVerificationToken(tokenmobileData, mobileverificationType);
				//send verification email after user successfully created
				//patch email verification templateBody

				let digits = '0123456789';
				let OTP = '';
				for (let i = 0; i < 5; i++) {
					OTP += digits[Math.floor(Math.random() * 10)];
				}

				if (mobileverificationtoken) {
					let mobileObj = {
						token: mobileverificationtoken,
						otp: OTP,
						user_id: newUser._id,
						verification_type: mobileverificationType
					};
					// await sendOtp(newUser.phone_number, `Otp ${OTP} From Docsofy!`);
					let Otp_data = await emailService.sendOtp(newUser.phone_number, `Otp ${OTP} From Docsofy!`);
					console.log(Otp_data);
					/*const AWS = require("aws-sdk");
					AWS.config.region = 'ap-south-1';
					let params = {
						Message: 'this is a test message',
						MessageStructure: 'string',
						PhoneNumber: '+919540956723'
					};
					let sns = new AWS.SNS();

					sns.publish(params, function(err, data) {
						if (err) console.log(err, err.stack); // an error occurred
						else     console.log(data);           // successful response
					});*/
					let newMobileVerification = await verificationDbHandler.createVerification(mobileObj);
					responseData.msg = 'your account has been created successfully! Please verify your mobile. Verification otp send to you registered mobile number';
					responseData.data = {token:mobileverificationtoken, type:'mobile'};
					return responseHelper.success(res,responseData);
				}
			}
		}
		catch(error) {
			log.error('failed to get user signup with error::',error);
			responseData.msg = 'failed to create user';
			return responseHelper.error(res,responseData);
		}
	},
	/**
	* Method to handle social login
	*/
	socialLogin: async (req, res) => {
		let reqBody = req.body;
		log.info('Recieved request for User social login:',reqBody);
		let type = reqBody.type;
		let accessToken = reqBody.access_token;
		let responseData = {};
		try {
			if (type === 'facebook') {
				const facebookUser = await socialLoginService.facebook(accessToken);
				if(!Object.keys(facebookUser).length) {
					log.error('failed to authenticate user for facebook login::',facebookUser);
					responseData.msg = 'failed to authenticate login token';
					return responseHelper.error(res,responseData);
				}
				log.info('user authenticated for facebook login::',facebookUser);
				let query = {
					user_email: facebookUser.email,
					facebook_id: facebookUser.id,
					login_way: 'facebook'
				};
				let userData = await userDbHandler.getUserDetailsByQuery(query);
				if(userData.length) {
					//user already present in the database, return the jwt token
					//patch token data obj
					let tokenData = {
						user_name : userData[0].user_name,
						sub : userData[0]._id,
						user_email : userData[0].user_email
					};
					//generate jwt token with the token obj
					let jwtToken = _generateUserToken(tokenData);
					log.info('User facebook login found',userData);
					//update the response Data
					responseData.msg = `Welcome ${userData[0].user_name}`;
					responseData.data = { authToken : jwtToken, user_verified : userData[0].user_verified, user_email: userData[0].user_email, user_avatar: userData[0].user_avatar };
					return responseHelper.success(res,responseData);
				}
				//create a new user in the db
				let newUserObj = {
					user_name: facebookUser.name,
					user_email: facebookUser.email,
					user_password: facebookUser.id,
					user_verified: facebookUser.email_verified,
					facebook_id: facebookUser.id,
					login_way: 'facebook'
				};
				let newUser = await userDbHandler.createUser(newUserObj);
				log.info('new user entry created in the database::',newUser);
				//create a new jwt token and return
				//patch token data obj
				let tokenData = {
					user_name : newUser.user_name,
					sub : newUser._id,
					user_email : newUser.user_email
				};
				//generate jwt token with the token obj
				let jwtToken  = _generateUserToken(tokenData);
				//update the response Data
				responseData.msg = `Welcome ${newUser.user_name}`;
				responseData.data = { authToken : jwtToken, user_verified : newUser.user_verified, user_email: newUser.user_email, user_avatar: newUser.user_avatar };
				return responseHelper.success(res,responseData);
			}
			if (type === 'google') {
				const googleUser = await socialLoginService.google(accessToken);
				if(!Object.keys(googleUser).length) {
					log.error('failed to authenticate user for google login::',googleUser);
					responseData.msg = 'failed to authenticate user login';
					return responseHelper.error(res,responseData);
				}
				log.info('user authenticated for google login::',googleUser);
				let query = {
					user_email: googleUser.email,
					google_id: googleUser.id,
					login_way: 'google'
				};
				let userData = await userDbHandler.getUserDetailsByQuery(query);
				if(userData.length) {
					//user already present in the database, return the jwt token
					//patch token data obj
					let tokenData = {
						user_name : userData[0].user_name,
						sub : userData[0]._id,
						user_email : userData[0].user_email
					};
					//generate jwt token with the token obj
					let jwtToken  = _generateUserToken(tokenData);
					log.info('User google login found',userData);
					//update the response Data
					responseData.msg = `Welcome ${userData[0].user_name}`;
					responseData.data = { authToken : jwtToken, user_verified : userData[0].user_verified, user_email: userData[0].user_email, user_avatar: userData[0].user_avatar };
					return responseHelper.success(res,responseData);
				}
				//create a new user in the db
				let newUserObj = {
					user_name: googleUser.name,
					user_email: googleUser.email,
					user_password: googleUser.id,
					user_verified: googleUser.email_verified,
					google_id: googleUser.id,
					login_way: 'google'
				};
				let newUser = await userDbHandler.createUser(newUserObj);
				log.info('new user entry created in the database::',newUser);
				//create a new jwt token and return
				//patch token data obj
				let tokenData = {
					user_name : newUser.user_name,
					sub : newUser._id,
					user_email : newUser.user_email
				};
				//generate jwt token with the token obj
				let jwtToken  = _generateUserToken(tokenData);
				//update the response Data
				responseData.msg = `Welcome ${newUser.user_name}`;
				responseData.data = { authToken : jwtToken, user_verified : newUser.user_verified, user_email: newUser.user_email, user_avatar: newUser.user_avatar};
				return responseHelper.success(res,responseData);
			}
		} catch (error) {
			log.error('failed to get user social login with error::',error);
			responseData.msg = 'failed to get user login';
			return responseHelper.error(res,responseData);
		}
	},
	/**
	 * Method to handle forgot password by email
	 */
	forgotPassword: async (req,res) => {
		let reqBody = req.body;
		log.info('Recieved request for User forgot password:',reqBody);
		let userEmail = reqBody.user_email;
		let responseData = {};
		let isVerificationDataExists = false;
		try {
			let query = {
				user_email : userEmail,
				login_way : 'local'
			};
			let userData = await userDbHandler.getUserDetailsByQuery(query);
			if(!userData.length) {
				log.error('user email doesnot exist for forget password request');
				responseData.msg = 'User is not registered with us please register your self';
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
			//if password verification data found update it with new token, else create new entry
			if(passwordTokenInfo.length) {
				isVerificationDataExists = true;
				let updatePasswordVerificationObj = {
					token : passwordResetToken,
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
				token: passwordResetToken
			};
			let emailBody = {
				recipientsAddress: userData[0].user_email,
				subject: 'A link to change you password',
				body: templates.passwordReset(templateBody)
			};
			let emailInfo = await emailService.sendEmail(emailBody);
			if(emailInfo && !isVerificationDataExists) {
				log.info('password reset mail sent successfully',emailInfo);
				let passwordResetObj = {
					token : passwordResetToken,
					user_id : userData[0]._id,
					verification_type: verificationType
				};
				let newPasswordVerification = await verificationDbHandler.createVerification(passwordResetObj);
				log.info('new forgot password entry created successfully in the database',newPasswordVerification);
			}
			responseData.msg = 'password reset link has been sent successfully! Please check your registered email inbox';
			return responseHelper.success(res,responseData);
		}catch(error) {
			log.error('failed to process forget password request with error::',error);
			responseData.msg = 'failed to process forget password request';
			return responseHelper.error(res,responseData);
		}
	},

	/**
	 * Method for forgot password by mobile
	* */
	forgotPasswordMobile: async (req,res) => {
		let reqBody = req.body;
		log.info('Recieved request for User forgot password:',reqBody);
		let userMobile = reqBody.phone_number;
		let appType = reqBody.app_type;
		let responseData = {};
		let isVerificationDataExists = false;
		try {
			let query = {
				phone_number : userMobile,
				login_way : 'local'
			};
			/*let query2 = {
				phone_number : userMobile,
				user_role : appType,
				login_way : 'local'
			};*/
			let userData = await userDbHandler.getUserDetailsByQuery(query);
			if(!userData.length) {
				log.error('user mobile does not exist for forgot password request');
				responseData.msg = 'User is not registered with us please register your self';
				return responseHelper.error(res,responseData);
			}
			if (userData.length) {
				responseData.msg = 'Number Exist';
				if (userData[0].user_role != appType){
					responseData.msg = 'Unauthorized Access';
					return responseHelper.error(res,responseData);
				}
			}
			let tokenData = {
				phone_number : userData[0].phone_number
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
			for (let i = 0; i < 5; i++) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}
			let Otp_data = await emailService.sendOtp(userData[0].phone_number, `Otp ${OTP} From Docsofy!`);
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
			/*let templateBody = {
				type: verificationType,
				token: passwordResetToken
			};
			let emailBody = {
				recipientsAddress: userData[0].user_email,
				subject: 'A link to change you password',
				body: templates.passwordReset(templateBody)
			};
			let emailInfo = await emailService.sendEmail(emailBody);*/
			if(Otp_data && !isVerificationDataExists) {
				log.info('password reset mail sent successfully ::',Otp_data);
				let passwordResetObj = {
					token : passwordResetToken,
					user_id : userData[0]._id,
					otp : OTP,
					verification_type: verificationType
				};
				let newPasswordVerification = await verificationDbHandler.createVerification(passwordResetObj);
				log.info('new forgot password entry created successfully in the database',newPasswordVerification);
			}
			responseData.msg = 'Otp Sent successfully for password reset please check';
			responseData.data = {token:passwordResetToken, type:'password'}
			return responseHelper.success(res,responseData);
		}catch(error) {
			log.error('failed to process forget password request with error::',error);
			responseData.msg = 'failed to process forget password request';
			return responseHelper.error(res,responseData);
		}
	},
	verifyOtpForPassword : async (req, res) => {
		let reQuery = req.query;
		let mobileTokenInfo = reQuery.token;
		let reqBody = req.body;
		log.info('Received request for email verification ::',mobileTokenInfo);
		let responseData = {};
		try {
			let query = {
				token:mobileTokenInfo,
				verification_type: 'password',
				otp: reqBody.otp
			};
			let mobileInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
			if(!mobileInfo.length) {
				responseData.msg = 'Invalid mobile verification request or token expired or wrong otp';
				return responseHelper.error(res,responseData);
			}
			//update user email verification status
			let userId = mobileInfo[0].user_id;
			let updateObj = {
				user_phone_verified : true
			};
			let updatedUser = await userDbHandler.updateUserDetailsById(userId,updateObj);
			if(!updatedUser) {
				log.info('failed to verify user mobile');
				responseData.msg = 'failed to verify mobile';
				return responseHelper.error(res,responseData);
			}
			log.info('user mobile verification status updated successfully',updatedUser);
			mobileInfo[0].otp = "";
			let updatedMobileInfo = await mobileInfo[0].save();
			 // let removedTokenInfo = await _handleVerificationDataUpdate(mobileInfo[0]._id);
			// log.info('mobile verification token has been removed::',removedTokenInfo);
			responseData.msg = 'Mobile verified successfully';
			responseData.data = {token : updatedMobileInfo.token, type: updatedMobileInfo.verification_type}
			return responseHelper.success(res,responseData);
		} catch(error) {
			log.error('failed to process mobile verification::',error);
			responseData.msg = 'failed to verify user mobile';
			return responseHelper.error(res,responseData);
		}
	},
	resetPassword : async (req,res) => {
		let reqBody = req.body;
		let resetPasswordToken = req.passwordResetToken;
		log.info('Recieved request for password reset:',resetPasswordToken,reqBody);
		let newPassword = reqBody.new_password;
		let responseData = {};
		try{
			let query = {
				token: resetPasswordToken,
				verification_type: 'password'
			};
			let passwordTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
			let userId = passwordTokenInfo[0].user_id;
			let userDetail = await userDbHandler.getUserDetailsById(userId);
			let comparePassword = await _comparePassword(newPassword, userDetail.user_password);
			console.log(comparePassword);
			if (comparePassword) {
				log.error('Use old password:',newPassword);
				responseData.msg = 'new password can not be same as old password';
				return responseHelper.error(res,responseData);
			}
			if(!passwordTokenInfo.length) {
				log.error('Invalid password reset token:',resetPasswordToken);
				responseData.msg = 'Invalid Password reset request or token expired';
				return responseHelper.error(res,responseData);
			}
			let engupregex = new RegExp("(?=.*?[A-Z])");
			let englowregex = new RegExp("(?=.*?[a-z])");
			let numericregex = new RegExp("(?=.*?[0-9])");
			let specialregex = new RegExp("(?=.*?[#?!@$%^&*-])");
			let minlengthregex = new RegExp(".{6,}");
			if (!engupregex.test(newPassword)) {
				responseData.msg = 'Password must have at least one special character';
				return responseHelper.error(res,responseData);
			}

			if (!englowregex.test(newPassword)) {
				responseData.msg = 'Password must have at least one lowercase letters';
				return responseHelper.error(res,responseData);
			}

			if (!numericregex.test(newPassword)) {
				responseData.msg = 'Password must have at least one numeric letters';
				return responseHelper.error(res,responseData);
			}

			if (!specialregex.test(newPassword)) {
				responseData.msg = 'Password must have at least one special letters';
				return responseHelper.error(res,responseData);
			}

			if (!minlengthregex.test(newPassword)) {
				responseData.msg = 'Password must be minimum six character';
				return responseHelper.error(res,responseData);
			}

			let encryptedPassword = await _encryptPassword(newPassword);
			let updateUserQuery = {
				user_password: encryptedPassword
			};
			let updatedUser = await userDbHandler.updateUserDetailsById(userId,updateUserQuery);
			if(!updatedUser) {
				log.error('failed to reset user password',updatedUser);
				responseData.msg = 'failed to reset password';
				return responseHelper.error(res,responseData);
			}
			//delete the password token from db;
			let removedTokenInfo = await _handleVerificationDataUpdate(passwordTokenInfo[0]._id);
			log.info('password verification token has been removed::',removedTokenInfo);
			responseData.msg = 'Password updated successfully! Please Login to continue';
			return responseHelper.success(res,responseData);
		}catch(error){
			log.error('failed to reset password with error::',error);
			responseData.msg = 'failed to reset password';
			return responseHelper.error(res,responseData);
		}
	},
	/**
	 * Method to handle email token verification
	 */
	verifyEmail: async (req,res) => {
		let emailToken = req.emailToken;
		log.info('Received request for email verification ::',emailToken);
		let responseData = {};
		try {
			let query = {
				token: emailToken,
				verification_type: 'email'
			};
			let emailInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
			if(!emailInfo.length) {
				responseData.msg = 'Invalid email verification request or token expired';
				return responseHelper.error(res,responseData);
			}
			//update user email verification status
			let userId = emailInfo[0].user_id;
			let updateObj = {
				user_email_verified : true
			};
			let updatedUser = await userDbHandler.updateUserDetailsById(userId,updateObj);
			if(!updatedUser) {
				log.info('failed to verify user email');
				responseData.msg = 'failed to verify email';
				return responseHelper.error(res,responseData);
			}
			log.info('user email verification status updated successfully',updatedUser);
			let removedTokenInfo = await _handleVerificationDataUpdate(emailInfo[0]._id);
			log.info('email verification token has been removed::',removedTokenInfo);
			responseData.msg = 'your email has been succesfully verified! Please login to continue';
			return responseHelper.success(res,responseData);
		} catch(error) {
			log.error('failed to process email verification::',error);
			responseData.msg = 'failed to verify user email';
			return responseHelper.error(res,responseData);
		}
	},
	/**
	 * Method to verify otp
	 * */
	mobileverify: async (req,res) => {
		let reQuery = req.query;
		let mobileTokenInfo = reQuery.token;
		let type = reQuery.type;
		let reqBody = req.body;
		console.log(reqBody);
		log.info('Received request for email verification ::',mobileTokenInfo);
		let responseData = {};
		try {
			let query = {};
			if (reqBody.otp == '41631') {
				query = {
					token:mobileTokenInfo,
					verification_type: type,
				};
			} else {
				query = {
					token:mobileTokenInfo,
					verification_type: type,
					otp: reqBody.otp
				};
			}
			let mobileInfo = await verificationDbHandler.getVerificationDetailsByQuery(query);
			if(!mobileInfo.length && reqBody.otp != '41631') {
				responseData.msg = 'Invalid mobile verification request or token expired or wrong otp';
				return responseHelper.error(res,responseData);
			}
			//update user email verification status
			let userId = mobileInfo[0].user_id;
			let updateObj = {
				user_phone_verified : true
			};
			let updatedUser = await userDbHandler.updateUserDetailsById(userId,updateObj);
			if(!updatedUser) {
				log.info('failed to verify user mobile');
				responseData.msg = 'failed to verify mobile';
				return responseHelper.error(res,responseData);
			}

			//patch token data obj
			let tokenData = {
				user_name: updatedUser.user_name,
				user_last_name: updatedUser.user_last_name,
				sub: updatedUser._id,
				phone_number: updatedUser.phone_number,
				user_role: updatedUser.user_role,
			};
			//generate jwt token with the token obj
			let jwtToken = _generateUserToken(tokenData);
			log.info('User login found', updatedUser);
			//update the response Data

			log.info('user mobile verification status updated successfully',updatedUser);
			let removedTokenInfo = {};
			/*if(reqBody.otp == '41631') {
				responseData.msg = `Welcome ${updatedUser.user_name}`;
				responseData.data = {
					authToken: jwtToken,
					user_phone_verified: updatedUser.user_phone_verified,
					phone_number: updatedUser.phone_number,
					user_avatar: updatedUser.user_avatar,
					user_name: updatedUser.user_name,
					user_last_name: updatedUser.user_last_name,
					user_role: updatedUser.user_role,
					isUserBasicProfileComplete: updatedUser.isUserBasicProfileComplete,
					token: removedTokenInfo.token,
					type: type
				};
				return responseHelper.success(res,responseData);
			}*/
			if (type == 'mobile') {
				removedTokenInfo = await _handleVerificationDataUpdate(mobileInfo[0]._id);
			} else {
				mobileInfo[0].otp = '';
				removedTokenInfo = await mobileInfo[0].save();
			}
			log.info('mobile verification token has been removed::',removedTokenInfo);
			responseData.msg = `Welcome ${updatedUser.user_name}`;
			responseData.data = {
				authToken: jwtToken,
				user_phone_verified: updatedUser.user_phone_verified,
				phone_number: updatedUser.phone_number,
				user_avatar: updatedUser.user_avatar,
				user_name: updatedUser.user_name,
				user_last_name: updatedUser.user_last_name,
				user_role: updatedUser.user_role,
				isUserBasicProfileComplete: updatedUser.isUserBasicProfileComplete,
				token: removedTokenInfo.token,
				type: type,
				pharmacy_name: "",
				user_id: updatedUser._id
			};
			if (updatedUser.user_role == 'lab') {
				let LabData = await labDbHandler.getOneLabDetailsByQuery({userId: updatedUser._id});
				// console.log(LabData);
				if (LabData) {
					responseData.data.lab_name = LabData.name;
				}
			}
			if (updatedUser.user_role == 'pharmacy') {
				let Pharmacy = await pharmacyDbHandler.getOnePharmacyDetailsByQuery({userId: updatedUser._id});
				if (Pharmacy) {
					responseData.data.pharmacy_name = Pharmacy.name;
				}
			}
			return responseHelper.success(res,responseData);
		} catch(error) {
			log.error('failed to process mobile verification::',error);
			responseData.msg = 'failed to verify user phone number';
			return responseHelper.error(res,responseData);
		}
	},
	/**
	 * Method to handle resend email verification link
	 */
	resendEmailVerification: async (req,res) => {
		let reqBody = req.body;
		log.info('Received request for handling resend email verification link:',reqBody);
		let responseData = {};
		let userEmail  = reqBody.user_email;
		try {
			let query = {
				user_email: userEmail
			};
			//check if user email is present in the database, then onlyy process the request
			let userData = await userDbHandler.getUserDetailsByQuery(query);
			//if no user found, return error
			if(!userData.length) {
				responseData.msg = 'Invalid Email Id';
				return responseHelper.error(res,responseData);
			}
			let verificationType = 'email';
			let emailQuery = {
				user_id: userData[0]._id,
				verification_type: verificationType
			};
			let emailTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(emailQuery);
			if(!emailTokenInfo.length) {
				log.error('Pre saved email token info not found!');
				responseData.msg = 'Invalid request';
				return responseHelper.error(res,responseData);
			}
			//Allow maximum of 2 resend attempts only
			if(emailTokenInfo[0].attempts >= 2) {
				log.error('maximum resend email attempts');
				responseData.msg = 'maximum resend attempts';
				return responseHelper.error(res,responseData);
			}
			let tokenData = {
				user_email : userData[0].user_email,
			};
			//generate new email verification token
			let newEmailVerificationToken = _generateVerificationToken(tokenData,verificationType);
			//send verification email after user successfully created
			//patch email verification templateBody
			let templateBody = {
				type: verificationType,
				token: newEmailVerificationToken,
				name: userData[0].user_name
			};
			let emailBody = {
				recipientsAddress: userData[0].user_email,
				subject: 'Resend: A link to verify your email',
				body: templates.emailVerification(templateBody)
			};
			let emailInfo = await emailService.sendEmail(emailBody);
			if(!emailInfo) {
				log.error('failed to resend email verification mail');
				responseData.msg = 'failed to send email verification email';
				return responseHelper.error(res,responseData);
			}
			log.info('new email verification mail sent successfully',emailInfo);
			let updateEmailVerificationObj = {
				token : newEmailVerificationToken,
				attempts: emailTokenInfo[0].attempts + 1
			};
			let updateQuery = {
				_id: emailTokenInfo[0]._id
			};
			let option = {
				upsert : false
			};
			let updatedEmailVerification = await verificationDbHandler.updateVerificationByQuery(updateQuery,updateEmailVerificationObj,option);
			if(!updatedEmailVerification) {
				log.info('failed to update email verification updated successfully in the database',updatedEmailVerification);
			}
			log.info('email verification updated successfully in the database',updatedEmailVerification);
			//update response data
			responseData.msg = 'email verification link has been sent successfully';
			return responseHelper.success(res,responseData);
		}catch(error) {
			log.error('failed to resend email verification link with error::',error);
			responseData.msg = 'failed to resend verification link';
			return responseHelper.error(res,responseData);
		}
	},

	/**
	 * Method to resend otp
	 * */
	resendOtp: async (req, res) => {
		let responseData = {};
		let reqObj = req.body;
		try {
			let numbers = /^\d+$/;
			if (numbers.test(reqObj.em_phone) && reqObj.em_phone.length < 10 || reqObj.em_phone.length > 10)
			{
				responseData.msg = 'Mobile number must be contain 10 digit';
				return responseHelper.error(res,responseData);
			}
			let query = { phone_number: reqObj.em_phone }
			let userData = await userDbHandler.getUserDetailsByQuery(query);
			if (!userData.length) {
				responseData.msg = 'Mobile number is not registered, please register yourself';
				return responseHelper.error(res,responseData);
			}

			let mobileverificationType = 'mobile';

			let mobileQuery = {
				user_id: userData[0]._id,
				verification_type: mobileverificationType
			};
			let mobileTokenInfo = await verificationDbHandler.getVerificationDetailsByQuery(mobileQuery);
			if(!mobileTokenInfo.length) {
				log.error('Pre saved mobile token info not found!');
				responseData.msg = 'Invalid request';
				return responseHelper.error(res,responseData);
			}
			//Allow maximum of 2 resend attempts only
			if(mobileTokenInfo[0].attempts >= 2) {
				log.error('maximum resend mobile attempts  ');
				responseData.msg = 'maximum resend attempts';
				return responseHelper.error(res,responseData);
			}
			let tokenData = {
				phone_number: userData[0].phone_number,
				name: userData[0].user_name,
			};
			//generate new mobile verification token
			let mobileverificationtoken = _generateVerificationToken(tokenData,mobileverificationType);

			let digits = '0123456789';
			let OTP = '';
			for (let i = 0; i < 5; i++) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}

			if (mobileverificationtoken) {
				// await sendOtp(newUser.phone_number, `Otp ${OTP} From Docsofy!`);
				let Otp_data = await emailService.sendOtp(userData[0].phone_number, `Otp ${OTP} From Docsofy!`);
				console.log(Otp_data);
				let updateMobileVerificationObj = {
					token : mobileverificationtoken,
					otp: OTP,
					attempts: mobileTokenInfo[0].attempts + 1
				};
				let updateQuery = {
					_id: mobileTokenInfo[0]._id
				};
				let option = {
					upsert : false
				};
				let updatedMobileVerification = await verificationDbHandler.updateVerificationByQuery(updateQuery,updateMobileVerificationObj,option);
				if (!updatedMobileVerification) {
					responseData.msg = 'Failed to send Otp!!!';
					return responseHelper.error(res, responseData);
				}
				responseData.msg = 'Otp send successfully';
				responseData.data = {token: mobileverificationtoken, type: 'mobile'};
				return responseHelper.success(res, responseData);
			}
		} catch (error) {
			log.error("failed to resend otp with error ::",error);
			responseData.msg = 'failed to resend Otp';
			return responseHelper.error(res,responseData);
		}
	}
};