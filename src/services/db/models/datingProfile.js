'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../../config/environments');
/**
 * Creating User Schema Model
 */
const datingProfileSchema = new Schema({
    pictures:{
        type: [String],
        default: [],
    },  
    age: {
        type: Number,
        default: '',
    },
    height: {
        type: String,
        default: '',
    },
    weight: {
        type: Number,
        default: '',
    },
    looking_for:{
        type: String,
        enum: ["male","female", "others"],
        default: ""
    },
    about:{
        type: String,
        default: ""
    },
    address: {
            city: { type: String, default: "" },
            country: {type: String, default: ""},
        },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'[lng,lat]
            default: 'Point',
        },
        coordinates: { type: [], default: [0.0000, 0.0000] },
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
datingProfileSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Dating Profile', datingProfileSchema);

