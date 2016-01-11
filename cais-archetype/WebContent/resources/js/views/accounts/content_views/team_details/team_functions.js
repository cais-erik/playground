define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'text!templates/accounts/team_detail/team_functions.html',
	'collections/setup/permissions'
], function ($, _, Backbone, Vm, Template, Permissions) {
	var TeamBasicInfo = Backbone.View.extend({
		options: {},
		className: 'team-functions',
		_modelBinder: undefined,
		initialize: function() {
			Permissions.fetch({
				success: _.bind(this.render, this)
			});
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(template(Permissions.toJSON()));
		},
		events: {
			'change .permission-check': 'onPermissionChange',
		},
		onPermissionChange: function(e) {
			var elem = $(e.target);
			var id = $(e.target).val();

			if (elem.is(':checked')) {
				this.model.setFunctionPermission(id, true);
			}
			else {
				this.model.setFunctionPermission(id, false);
			}
		},
		saveModel: function() {
			var that = this;
			this.model.save([], {
				success: function() {
					that.trigger('saveSuccess');
				}
			});
		},

		clean: function() {
			this.stopListening();
		}
	});
	return TeamBasicInfo;
});