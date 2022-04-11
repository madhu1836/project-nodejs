const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	auth: {
		user: 'mailto:youthsocailservice@gmail.com',
		pass: 'qwerty@123',
	},
});
module.exports = {
	sendEmail: async (emailBody) => {
		try {
			// send mail with defined transport object
			let emailInfo = {
				from: '"Youth Social Service" youthsocailservice@gmail.com', // sender address
				to: emailBody.recipientsAddress, // list of receivers
				subject: emailBody.subject, // Subject line
				html: emailBody.body
			};
			transporter.sendMail(emailInfo);
			return true;
		}
		catch (error) {
			return error;
		}
	},
	// sendSignupEmail: async (emailBody) => {
	// 	try {
	// 		// send mail with defined transport object
	// 		let emailInfo = {
	// 			from: 'mailto:support@sos.com', // sender address
	// 			to: 'mailto:sos.com@gmail.com', // list of receivers
	// 			subject: emailBody.subject, // Subject line
	// 			html: emailBody.body
	// 		};
	// 		sgMail.send(emailInfo);
	// 		return true;
	// 	}
	// 	catch (error) {
	// 		return error;
	// 	}
	// },

	// sendOtp: async (mobileNo, msg) => {
	// 	return new AWS.SNS({ apiVersion: "2020-6-10" })
	// 		.publish({
	// 			Message: msg,
	// 			PhoneNumber: "+91" + mobileNo,
	// 		})
	// 		.promise();
	// }
};



















// 'use strict';
// const sgMail = require('@sendgrid/mail');
// const config = require('../../config/environments');

// sgMail.setApiKey(config.emailServiceInfo.senderEmail);

// const AWS = require("aws-sdk");
// module.exports = {
// 	sendEmail: async (emailBody) => {
// 		try {
// 			// send mail with defined transport object
// 			let emailInfo = {
// 				from: 'support@youth_social_service.com', // sender address
// 				to: emailBody.recipientsAddress, // list of receivers
// 				subject: emailBody.subject, // Subject line
// 				html: emailBody.body
// 			};
// 			sgMail.send(emailInfo);
// 			return true;
// 		}
// 		catch(error) {
// 			return error;
// 		}
// 	},
// 	sendSignupEmail:async (emailBody) => {
// 		try {
// 			// send mail with defined transport object
// 			let emailInfo = {
// 				from: 'support@youth_social_service.com', // sender address
// 				to: 'youth_social_service.com@gmail.com', // list of receivers
// 				subject: emailBody.subject, // Subject line
// 				html: emailBody.body
// 			};
// 			sgMail.send(emailInfo);
// 			return true;
// 		}
// 		catch(error) {
// 			return error;
// 		}
// 	},

// 	sendOtp: async (mobileNo, msg) => {
// 		return new AWS.SNS({ apiVersion: "2020-6-10" })
// 			.publish({
// 				Message: msg,
// 				PhoneNumber: "+91" + mobileNo,
// 			})
// 			.promise();
// 	}
// };
