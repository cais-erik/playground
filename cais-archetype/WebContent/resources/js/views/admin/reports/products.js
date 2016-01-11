define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'views/admin/reports/base_report',
	'views/admin/reports/lists/active_clients',
	'views/admin/reports/lists/near_term_conversion_clients',
	'text!templates/admin/reports/products.html'
], function ($, _, Backbone, Vm, Events, Handlebars, BaseReport, ActiveClients, NearTermConversionClients, Template) {
	var ProductReport = BaseReport.extend({
		options: {},
		template: Template,
		title: 'Products',
		className: 'dashboard-view',
		events: {},
		loadCount: 0,
		postRender: function() {
			this.activeClients = Vm.create(this, 'ActiveClients', ActiveClients, {
				el: this.$('.active-clients'),
				productType: this.options.productType
			});
			this.nearTermClients = Vm.create(this, 'NearTermConversionClients', NearTermConversionClients, {
				el: this.$('.near-term-conversion-clients'),
				productType: this.options.productType
			});

			this.listenTo(this.activeClients, 'view:ready', this.checkIfReady);
			this.listenTo(this.nearTermClients, 'view:ready', this.checkIfReady)
		},
		checkIfReady: function() {
			this.loadCount = this.loadCount += 1;
			if (this.loadCount === 2) {
				this.trigger('view:ready');		
			}
		}
	});
	return ProductReport;
});