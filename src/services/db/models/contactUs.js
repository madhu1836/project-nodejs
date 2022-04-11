'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const contactSchema = new Schema({

    message: {
        type: String,
        default: '',
    },
    name: {
        type:String,
        trim:true,
    },
    user_email: {
        type:String,
        trim:true,
    }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('contactUs', contactSchema);