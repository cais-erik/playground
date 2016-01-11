define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/products/selected_products',
	'text!templates/products/assets/selected_product_list.html',
	'views/products/trader/trader_dialog'
], function ($, _, Backbone, Vm, Events, Handlebars, SelectedProducts, Template, TraderDialog) {
	var SelectedProductList = Backbone.View.extend({
		collection: SelectedProducts,
		className: 'selected-product-list-view clearfix',
		initialize: function() {
			this.render();
			this.listenTo(SelectedProducts, 'add', this.addOne);
			this.listenTo(SelectedProducts, 'remove', this.removeOne);
			this.listenTo(SelectedProducts, 'add remove', this.onCollectionChange);
		},
		render: function() {
			this.$el.html(Template);
			this.onCollectionChange();
		},
		events: {
			'click .show-trader': 'showTrader'
		},
		listItemTemplate: '<li id="selected-{{internalCusip}}">{{name}}</li>',
		addOne: function(model, collection, options) {
			var template = Handlebars.compile(this.listItemTemplate);
			var listItem = $(template(model.toJSON()));

			listItem.hide().appendTo(this.$('ul')).fadeIn('fast');
		},
		removeOne: function(model, collection, options) {
			var item = this.$('#selected-' + model.id);
			item.fadeOut('fast', function() { item.remove(); });
		},
		onCollectionChange: function() {
			this.$('.selected-count').text(this.collection.length);
			if (this.collection.length) {
				this.$el.fadeIn('fast');
			} else {
				this.$el.fadeOut('fast');
			}
		},
		showTrader: function(e) {
			e.preventDefault();
			Vm.create(this, 'Trader', TraderDialog, {productContext: 'capMarkets'});
		}
	});
	return SelectedProductList;
});