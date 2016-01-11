define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_accredited_investor.html',
	'models/entity_info'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel) {
	var view = BaseDetailsView.extend({
		panelId: 10,
		template: Template,
		postRender: function() {
			this.setEntityTypeVisibility();
		}
	});
	return view;
});