define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/accounts/content_views/entity_details/base_entity_details',
	'text!templates/accounts/entity/entity_standing_wire.html',
	'models/entity_info'
], function ($, _, Backbone, Handlebars, BaseDetailsView, Template, EntityInfoModel) {
	var view = BaseDetailsView.extend({
		panelId: 9,
		template: Template,
		postRender: function() {
			// server rejects most values that are parsed to int
			this.$('input, select').addClass('noparse');
			if (this.model.get('isFATF') === null) {
				this.$('#fatfCountryTrue').attr('checked', 'checked').change();
			}
			if (this.model.get('additional_isFATF') === null) {
				this.$('#additional_fatfCountryTrue').attr('checked', 'checked').change();
			}
		}
	});
	return view;
});