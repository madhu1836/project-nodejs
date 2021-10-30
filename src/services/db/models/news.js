'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const newsSchema = new Schema({
    news_image: {
        type: String,
        default: '',
    },
    newsCategory_id: {
        type:mongoose.Schema.Types.ObjectId,
		ref: 'NewsCategory'
    },
    news_heading: {
        type: String,
        default: ''
    },
    short_description:{
        type: String,
        default: '',
    },
    detail_description: {
        type: String,
        default: ''
    },
    
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

newsSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('News', newsSchema);