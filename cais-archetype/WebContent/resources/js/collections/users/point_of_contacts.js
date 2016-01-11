define([
	'underscore',
	'backbone',
	'models/user/user'
], function(_, Backbone, User){
	/** 
     * Blocked Users Collection
     * Collection class for a list of blocked users
     */
	var PointOfContacts = Backbone.Collection.extend({
		url: '/api/user/pointOfContacts',
		model: User,
	});
	return PointOfContacts;
});

