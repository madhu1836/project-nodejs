/**
 * JOI Validation Schemas
 */
module.exports = {
	authSchema: require('./schemas/auth'),
	userInfoSchema: require('./schemas/user'),
	adminSchema: require('./schemas/admin'),
	newsSchema: require('./schemas/news'),
	newsCategorySchema: require('./schemas/newsCategory'),
	datingProfileSchema: require('./schemas/datingProfile'),
	moviesCategorySchema: require('./schemas/moviesCategory'),
	moviesSchema: require('./schemas/Movies'),
	searchMovieSchema: require('./schemas/searchMovie'),
	contactUsSchema: require('./schemas/contactUs'),
	staticContent: require('./schemas/staticContent'),
	userManagementSchema: require('./schemas/userManagement'),
	friendsList: require('./schemas/friendsList'),
};
