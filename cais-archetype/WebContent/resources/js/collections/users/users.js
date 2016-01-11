define([
	'underscore',
	'backbone',
	'models/user/user'
], function(_, Backbone, User){
	/** 
     * Generic users collection
     * Collection class for a list of blocked users
     */
	var Users = Backbone.Collection.extend({
		model: User,
	});
	return Users;
});

