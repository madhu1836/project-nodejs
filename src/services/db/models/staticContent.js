'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const contentSchema = new Schema({
    
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Static Content', contentSchema);