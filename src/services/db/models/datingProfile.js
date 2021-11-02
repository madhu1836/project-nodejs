'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const datingProfileSchema = new Schema({
    profile_image:{
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    gender:{
        type: String,
        enum: ["","male","female"],
        default: ""
    },
    bio:{
        type: String,
        default: '',
    },
    profile_email: {
        type: String,
        required: true,
        trim: true,
    },
    
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Profile', datingProfileSchema);

