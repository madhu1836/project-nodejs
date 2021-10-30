'use strict';

/***********************************************
 * SERVICE FOR HANDLING MONGODB QUERIES
 ***********************************************/
module.exports = {
	User: require('./user.service'),
	Verification: require('./verification.service'),
	Admin: require('./admin.service'),
	News: require('./news.service'),
	NewsCategory: require('./newsCategory.service')
};
