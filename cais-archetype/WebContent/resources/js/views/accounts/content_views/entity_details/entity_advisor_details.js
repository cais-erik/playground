define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_advisor_info.html',
	'models/advisor_info'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, Model) {
	var entityInfo = BaseDetailsView.extend({
		model: Model,
		panelId: 4,
		template: Template,
		initialize: function() {
			$('#entity-content .save').hide();
			var modelOptions = {
				params: {
					advisorTeamName: this.options.entity.advisorTeamName || null,
					// TODO: change backend or find a better way to get this id
					userId: this.options.entity.advisorId || this.options.entity.parent().parent().parent().parent().userId, 
					advisorTeamId: this.options.entity.advisorTeamId || null,
				}
			};
			this.model = new this.model(modelOptions);
			this.model.fetch({
				success: _.bind(this.render, this),
				error: function() {
					Alert('This entity could not be loaded.', 'OK');
				}
			});
		},
		clean: function() {
			$('#entity-content .save').show();
		}
	});
	return entityInfo;
});