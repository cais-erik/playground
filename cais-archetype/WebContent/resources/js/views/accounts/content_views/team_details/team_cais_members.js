define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'text!templates/accounts/team_detail/team_cais_members.html',
	'collections/setup/cais_team_members'
], function ($, _, Backbone, Vm, Template, CaisTeamMembers) {
	var TeamCaisMembers = Backbone.View.extend({
		initialize: function() {
			var that = this;
			if (this.model.get('clientId')) {
				CaisTeamMembers.getTeamMembersByClientId(this.model.get('clientId'), function() {
					that.context = CaisTeamMembers.toJSON();
					that.render();

				});
			}
			else {
				that.context = [];
				this.render();
			}
		},
		render: function() {
			var that = this;
			var template = Handlebars.compile(Template);

			this.$el.html(template(this.context));
		},
		events: {
		},
		clean: function() {
			this.stopListening();
		}
	});
	return TeamCaisMembers;
});