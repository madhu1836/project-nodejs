'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const moviesSchema = new Schema({
    movie_thumbnail: {
        type: String,
        default: '',
    },
    movie_link: {
        type: String,
        default: '',
    },
    moviesCategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoviesCategory'
    },
    movie_name: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: '',
    },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Movies', moviesSchema);