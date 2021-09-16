'use strict';
const { fcm_admin } = require('../../../services/fcm/fcm_config');
const logger = require('../../../services/logger');
const log = new logger('FcmController').getChildLogger();
const dbService = require('../../../services/db/services');
const responseHelper = require('../../../services/customResponse');
const userDbHandler = dbService.User;

module.exports = {
    saveDeviceToken: async (req, res) => {
        let responseData = {};
        let reqBody = req.body;
        try {
            let SaveObj = {fcm_token: reqBody.fcm_token};
            await userDbHandler.updateUserDetailsById(req.user.sub, SaveObj);
            responseData.msg = 'Token Save Successfully';
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to save device token with error::', error);
            responseData.msg = 'failed to save device token';
            return responseHelper.error(res, responseData);
        }
    },
    sendNotificationToDevice: async (req, res) => {
        let responseData = {};
        let reqBody = req.body;
        try {
            const { deviceToken, title, body } = reqBody;
            fcm_admin.messaging().sendToDevice(
                deviceToken,
                {
                    notification: {
                        body: body,
                        title: title,
                        sound: 'default',
                    },
                },
                {
                    priority: 'high',
                    timeToLive: 60 * 60 * 24,
                }
            );
          responseData.msg = "notification sanded";
          return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to send device notification with error::', error);
            responseData.msg = 'failed to send device notification';
            return responseHelper.error(res, responseData);
        }
    },
    sendCallNotification: async (req, res) => {
        let responseData = {};
        let userId = req.params.id;
        try {
            let Model = await userDbHandler.getUserDetailsById(userId);
            await fcm_admin.messaging().sendToDevice(
                Model.fcm_token,
                {
                    notification: {
                        body: 'Tap Me To Start Consultation',
                        title: `📞 Calling from ${req.user.user_name + ' ' + req.user.user_last_name}`,
                        sound: 'ringtone2',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                },
                {
                    priority: 'high',
                    timeToLive: 60 * 60 * 24,
                }
            );
            responseData.msg = "Sanded saved";
            return responseHelper.error(res, responseData);
        } catch (error) {
            log.error('failed to send device notification with error::', error);
            responseData.msg = 'failed to send device notification';
            return responseHelper.error(res, responseData);
        }
    }
}
