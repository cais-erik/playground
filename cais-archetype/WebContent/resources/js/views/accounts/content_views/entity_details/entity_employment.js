define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_employment.html',
	'models/entity_info',
	'amd/handlebars/handlebars.selectOptions'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel) {
	var entityInfo = BaseDetailsView.extend({
		panelId: 2,
		template: Template,
		postRender: function() {
			this.manageEntitySpecificVisibility();
		}
	});
	return entityInfo;
});