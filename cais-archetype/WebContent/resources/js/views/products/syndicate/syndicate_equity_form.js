define([
	'jquery',
	'underscore',
	'backbone',
	'amd/backbone/Backbone.ModelBinder',
	'Vm',
	'events',
	'handlebars',
	'views/products/base_offering_form',
	'collections/products/syndicate_all_offerings',
	'models/product/syndicate_equity_offering',
	'text!templates/products/syndicate/equity_offering_form.html'
], function ($, _, Backbone, Binder, Vm, Events, Handlebars, BaseOfferingForm, CapMarketsProducts, EquityOffering, Template) {
	var EquityProductForm = BaseOfferingForm.extend({
		_modelBinder: undefined,
		options: {
			offeringType: 'Equity'
		},
		template: Template,
		model: EquityOffering,
		collection: CapMarketsProducts,
		title: 'Equity Syndicate Offering',
		postRender: function() {
			if (this.options.editId) {
				this.$('[data-role=datepicker], [data-role=datetimepicker]').removeAttr('data-futuredate');
			}
			// CAIS-815, remove all required attrs
			this.$('[required]').removeAttr('required');
			this.$('form').data('kendoValidator').destroy();
		}
	});
	return EquityProductForm;
});