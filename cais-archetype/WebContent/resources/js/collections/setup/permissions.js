define([
	'underscore',
	'backbone',
	'collections/base_cais_collection',
	'models/authed_user'
], function(_, Backbone, BaseCollection, AuthedUser) {
	var Permissions = BaseCollection.extend({
		//url: '/getPermissions',
		initialize: function() {
			_.each(this.permissions, function(model) {
				this.add(new Backbone.Model(model));
			}, this);
		},
		permissions: [
			{
				name: 'Access Funds',
				id: 1
			},
			{
				name: 'Generate Recommendations',
				id: 2
			},
			{
				name: 'View Pipeline',
				id: 3
			},
			{
				name: 'View/Manage Transaction Details',
				id: 4
			},
			{
				name: 'View Investor Details',
				id: 5
			},
			{
				name: 'Add Investors',
				id: 6
			},
			{
				name: 'Add Users',
				id: 7
			},
			{
				name: 'Allow New User Setup',
				id: 8
			},
			{
				name: 'View CAIS Connect',
				id: 9
			},
			{
				name: 'View CAIS Accounts',
				id: 10
			},
			{
				name: 'View Rebates',
				id: 11
			}
		],
		// returns the user's currently avaiable permissions from the list as BB collection 
		getUsersAvailablePermissions: function() {
			var userPermissions = AuthedUser.get('userPermissions');
			var collection = new Backbone.Collection();
			_.each(userPermissions, function(permission) {
				collection.add(this.get(permission.permissionId));
			}, this);
			return collection;
		}
	});
	return new Permissions();
});