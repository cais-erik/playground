/*
TODO: move server call to delete doc to model
	  revise server side API to return files as an array
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_client_details.html',
	'models/client',
	'validator',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, Model) {
	var entityInfo = BaseDetailsView.extend({
		model: Model,
		panelId: null,
		template: Template,
		initialize: function() {
			$('#entity-content .save').hide();
			var modelOptions = {
				params: {
					investorId: this.options.entity.investorId || this.options.entity.parent().parent().investorId,
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
		render: function() {
			var template = Handlebars.compile(this.template);
			// un-nest address
			var context = this.model.toJSON().address;
			context.name = this.model.get('name');
			context.investorId = this.model.id;
			this.$el.html(template(context));
			kendo.init(this.$el);
			if (this.postRender) this.postRender();
		},
		clean: function() {
			$('#entity-content .save').show();
		}
	});
	return entityInfo;
});