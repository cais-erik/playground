define([
	'jquery',
	'underscore',
	'backbone',
	'amd/backbone/Backbone.ModelBinder',
	'Vm',
	'events',
	'handlebars',
	'views/assets/product_list/selected_product_list',
	'views/products/trader/root_trader',
	'text!templates/products/syndicate/select_entities.html'
], function ($, _, Backbone, Binder, Vm, Events, Handlebars, SelectedProducts, Trader, Template) {
	var SelectEntities = Backbone.View.extend({
		initialize: function() {
			this.$el.html(Template);
			setTimeout(this.render, 1); 
		},
		render: function() {
			//var template = Handlebars.compile(this.template);
			Vm.create(this, 'Trader', Trader, {
				el: $('.trader-container')
			});
			//this.selectedProductList = Vm.create(this, 'SelectedProductList', SelectedProductsList);
		},
		events: {
		}
	});
	return SelectEntities;
});