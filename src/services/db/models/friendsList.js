'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const friendsListSchema = new Schema({
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    status: {
        type: String,
        enum: ['0','1','2'],
        default: "0"
    },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Friends List', friendsListSchema);