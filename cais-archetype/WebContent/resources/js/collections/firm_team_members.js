define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var teamMemberModel = Backbone.Model.extend({
		idAttribute: 'userId',
		toJSON: function() {
			return _.pick(this.attributes, ['userId', 'roleName']);
		}
	});
	var FirmTeamMembers = Backbone.Collection.extend({
		model: teamMemberModel,
		setUrl: function(firmId) {
			this.url = '/api/group/firm/' + firmId + '/cais_team'
		},
		serialize: function() {
			return this.map(function(model){ return _.pick(model.attributes, ['userId', 'roleName'])});
		}
	});
	return FirmTeamMembers;
});