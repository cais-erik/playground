define([
	'underscore',
	'backbone',
	'models/user/user'
], function(_, Backbone, User){
	/** 
     * Blocked Users Collection
     * Collection class for a list of blocked users
     */
	var BlockedUsers = Backbone.Collection.extend({
		url: '/api/user/blocked',
		model: User,
	});
	return BlockedUsers;
});

