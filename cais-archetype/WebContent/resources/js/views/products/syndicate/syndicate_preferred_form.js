define([
	'jquery',
	'underscore',
	'backbone',
	'amd/backbone/Backbone.ModelBinder',
	'Vm',
	'events',
	'handlebars',
	'views/products/base_offering_form',
	'models/product/syndicate_preferred_offering',
	'collections/products/syndicate_all_offerings',
	'text!templates/products/syndicate/preferred_offering_form.html'
], function ($, _, Backbone, Binder, Vm, Events, Handlebars, BaseOfferingForm, PreferredOffering, CapMarketsProducts, Template) {
	var EquityProductForm = BaseOfferingForm.extend({
		model: PreferredOffering,
		template: Template,
		options: {
			offeringType: 'Preferred Stock'
		},
		collection: CapMarketsProducts,
		title: 'Preferred Stock Offering',
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