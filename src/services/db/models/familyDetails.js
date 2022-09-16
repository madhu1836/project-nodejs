'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const detailsSchema = new Schema({

    father_name: {
        type: String,
        trim: true,
    },
    mother_name: {
        type: String,
        trim: true,
    },
    wife: {
        type: String,
        trim: true,
    },
    no_of_children: {
        type: Number,
        trim: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Family Details', detailsSchema);