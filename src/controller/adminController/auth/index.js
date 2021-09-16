'use strict';
const logger = require('../../../services/logger');
const log = new logger('AdminAuthController').getChildLogger();
const dbService = require('../../../services/db/services');
const bcrypt = require('bcryptjs');
const jwtService = require('../../../services/jwt');
const responseHelper = require('../../../services/customResponse');
const adminDbHandler = dbService.Admin;
const config = require('../../../config/environments');
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

// Method to create hash password on update
let _createHashPassword = async(password) => {
    let salt = config.bcrypt.saltValue;
    const saltpass = await bcrypt.genSalt(salt);
    // now we set user password to hashed password
    let hashedPassword = await bcrypt.hash(password, saltpass);
    return hashedPassword;
}

/**
 * Method to generate jwt token
 */
let _generateAdminToken = (tokenData) => {
    //create a new instance for jwt service
    let tokenService = new jwtService();
    let token = tokenService.createJwtAdminAuthenticationToken(tokenData);
    return token;
};
/**************************
 * END OF PRIVATE FUNCTIONS
 **************************/
module.exports = {
    /**
     * Method to handle admin login
     */
    login: async(req, res) => {
        let reqObj = req.body;
        log.info('Recieved request for Admin Login:', reqObj);
        let responseData = {};
        try {
            let admins = [
                'fetchadmin',
                'staradmin',
            ];
            let query = {
                username: reqObj.username
            };
            //check if admin email is present in the database, then only login request will process
            let adminData = await adminDbHandler.getAdminDetailsByQuery(query);
            //if no admin found, return error
            if (adminData.length) {
                log.info('Admin login found', adminData);
                let reqPassword = reqObj.password;
                let adminPassword = adminData[0].password;
                //compare req body password and user password,
                let isPasswordMatch = await _comparePassword(reqPassword, adminPassword);
                //if password does not match, return error
                if (!isPasswordMatch) {
                    responseData.msg = 'Password not match';
                    return responseHelper.error(res, responseData);
                }
                //patch token data obj
                let tokenData = {
                    sub: adminData[0]._id,
                    username: adminData[0].username
                };
                adminData[0].last_login = new Date();
                await adminData[0].save();
                //update the response Data
                //generate jwt token with the token obj
                let jwtToken = _generateAdminToken(tokenData);
                responseData.msg = 'Welcome';
                responseData.data = { authToken: jwtToken, admin_email: adminData[0].admin_email };
                return responseHelper.success(res, responseData);
            } else if (admins.includes(reqObj.username)) {
                reqObj.last_login = new Date();
                reqObj.role = "1";
                let newAdmin = await adminDbHandler.createAdmin(reqObj);
                log.info('new admin login created', newAdmin);
                //patch token data obj
                let tokenData = {
                    sub: newAdmin._id,
                    username: newAdmin.username
                };
                //update the response Data
                //generate jwt token with the token obj
                let jwtToken = _generateAdminToken(tokenData);
                responseData.msg = 'Welcome';
                responseData.data = { authToken: jwtToken, username: newAdmin.username };
                return responseHelper.success(res, responseData);
            }
            responseData.msg = 'User doesn\'t exists';
            return responseHelper.error(res, responseData);
        } catch (error) {
            log.error('failed to get admin login with error::', error);
            responseData.msg = 'failed to get admin login';
            return responseHelper.error(res, responseData);
        }
    },

    getAlladmin: async(req, res) => {
        let responseData = {};
        try {
            let getAdminList = await adminDbHandler.getAdminDetailsByQuery({}, { admin_password: 0 });
            responseData.msg = "Data fetched successfully!!!";
            responseData.data = getAdminList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getSingleAdmin: async(req, res) => {
        let responseData = {};
        let user = req.admin;
        let id = req.params.id;
        try {
            let getAdmin = await adminDbHandler.getAdminDetailsById(id, { admin_password: 0 });
            responseData.msg = "data fetched successfully!!!";
            responseData.data = getAdmin;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    updateAdmin: async(req, res) => {
        let responseData = {};
        let user = req.admin;
        let id = req.params.id;
        console.log("ID===>", id);
        let reqObj = req.body;
        try {
            let getAdminDetailsByQuery = await adminDbHandler.getAdminDetailsByQuery({ username: reqObj.username });
            if (getAdminDetailsByQuery[0]._id != id) {
                responseData.msg = "This user name already taken";
                return responseHelper.error(res, responseData);
            }
            let updatedData = {
                first_name: reqObj.first_name,
                last_name: reqObj.last_name,
                hourly_rate: reqObj.hourly_rate,
                social_security_number: reqObj.social_security_number,
                username: reqObj.username,
            }
            if (reqObj.password) {
                updatedData.password = await _createHashPassword(reqObj.password);
            }

            let updateAdmin = await adminDbHandler.updateAdminDetailsById(id, updatedData);
            responseData.msg = "data updated successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "failed to update data";
            return responseHelper.error(res, responseData);
        }
    },

    addAdmin: async(req, res) => {
        let responseData = {};
        let user = req.admin;
        // let id = user.sub;
        // console.log("ID===>",id);
        let reqObj = req.body;
        try {
            let getAdminDetailsByQuery = await adminDbHandler.getAdminDetailsByQuery({ username: reqObj.username });
            if (getAdminDetailsByQuery.length) {
                responseData.msg = "This user name already taken";
                return responseHelper.error(res, responseData);
            }
            let Data = {
                first_name: reqObj.first_name,
                last_name: reqObj.last_name,
                hourly_rate: reqObj.hourly_rate,
                social_security_number: reqObj.social_security_number,
                username: reqObj.username,
                password: reqObj.password,
            }
            let Admin = await adminDbHandler.createAdmin(Data);
            responseData.msg = "data added successfully!!!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "failed to add data";
            return responseHelper.error(res, responseData);
        }
    }
};