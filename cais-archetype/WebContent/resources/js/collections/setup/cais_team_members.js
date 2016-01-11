define([
	'jquery',
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function($, _, Backbone, BaseCollection) {
	var teamMemberModel = Backbone.Model.extend({
		idAttribute: 'userId'
	});
	var CaisTeamMembers = BaseCollection.extend({
		url: '/getTeamMembersForWizard',
		allMembers: new Backbone.Collection({
			model: teamMemberModel
		}),
		getTeamMembers: function(group) {
			var model = this.findWhere({'groupName': group});
			var arr = [];
			_.each(model.get('members'), function(model) {
				arr.push(new teamMemberModel(model));
			});
			return new Backbone.Collection(arr);
		},
		getTeamMembersByClientId: function(id, callback) {
			var that = this;
			$.getJSON('/getCAISTeamMembersByClientId', {clientId: id}, function(response) {
				_.each(response.msg, function(model) {that.add(new that.model(model))});
				callback.call(that);
			});
		},
		parse: function(response) {
			var that = this;
			_.each(response.msg, function(val) {
				if (val.groupName === 'ROLE_ADMIN') val.displayName = 'Admin';
				if (val.groupName === 'ROLE_SALES') val.displayName = 'Sales';
				if (val.groupName === 'ROLE_FINOPS') val.displayName = 'Financial Operations';
				_.each(val.members, function(member) {
					var model = new teamMemberModel(member);
					that.allMembers.add(model);
				});
			});
			return response.msg;
		}
	});
	return new CaisTeamMembers();
});