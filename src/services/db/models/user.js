'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const userSchema = new Schema({

    first_name: {
        type: String,
        default: '',
    },
    last_name: {
        type: String,
        default: '',
    },
    phone_number: {
        type: String,
        default: '',
    },
    user_email: {
        type: String,
        default: '',
    },
    dob: {
        type: String,
        default: '',
    },
    user_password: {
        type: String,
        default: ''
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


/**
 * Method to Encrypt User password before Saving to Database
 */
userSchema.pre('save', function (next) {
    let user = this;
    let salt = config.bcrypt.saltValue;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('user_password')) {
        return next();
    }
    // generate a salt
    bcrypt.genSalt(salt, function (err, salt) {
        if (err) return next(err);
        // hash the password with new salt
        bcrypt.hash(user.user_password, salt, function (err, hash) {
            if (err) return next(err);
            // override the plain password with the hashed one
            user.user_password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('Users', userSchema);