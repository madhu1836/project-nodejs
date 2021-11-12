'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Creating Search Schema Model
 */
const SearchSchema = new Schema({
	movie_name:{
		type: String,
		required: true,
		
	}
    
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.model('Search', SearchSchema);
