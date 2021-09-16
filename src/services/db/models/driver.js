'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating Driver Schema Model
 */
const driverSchema = new Schema(
	{
		first_name: {
			type: String,
			required: true,
			trim: true,
		},
		last_name: {
			type: String,
			trim: true,
		},
		fcm_token: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			default: ''
		},
		email_verified: {
			type: Boolean,
			default: false,
		},
        area_code: {
			type: String,
			trim: true,
		},
		phone_number: {
			type: String,
			trim: true,
		},
		phone_verified: {
			type: Boolean,
			default: false,
		},
		login_way: {
			type: String,
			enum: ['local', 'facebook', 'google'],
			default: 'local',
		},
		avatar: {
			type: String,
			default: '',
		},
		bio: {
			type: String,
			default: '',
		},
		dob: {
			type: String,
			default: ""
		},
		sex: {
			type: String,
			enum: ['', 'male', 'female', 'others'],
			default: ''
		},
		address: {
            mailing_address: { type: String, default: "" },
			street: { type: String, default: "" },
			street2: {type: String, default: ""},
			city: { type: String, default: "" },
			state: { type: String, default: "" },
			zip: { type: String, default: "" },
			country: { type: String, default: "" },
		},
		location: {
			  type: String,
			// type: {
			// 	type: String,
			// 	enum: ['Point'], // 'location.type' must be 'Point'[lng,lat]
			// 	default: 'Point',
			// },
			// coordinates: { type: [], default: [0.0000, 0.0000] },
		},
        prefer_start_date: {
            type: String,
            default: ''
        },
		resume: {
            type: String,
            default: ''
        },
		last_login: {
			type: String,
			default: "",
		},
        is_verify: {
            type: Boolean,
			default: false,
        }
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);
/**
 * Method to Encrypt User password before Saving to Database
 */
driverSchema.pre('save', function (next) {
	let user = this;
	let salt = config.bcrypt.saltValue;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) {
		return next();
	}
	// generate a salt
	bcrypt.genSalt(salt, function (err, salt) {
		if (err) return next(err);
		// hash the password with new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			// override the plain password with the hashed one
			user.password = hash;
			next();
		});
	});
});
module.exports = mongoose.model('Drivers', driverSchema);
