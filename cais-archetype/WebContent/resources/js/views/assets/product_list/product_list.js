define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'collections/products/selected_products',
	'views/products/trader/trader_dialog'
], function ($, _, Backbone, Vm, Events, SelectedProducts, TraderDialog) {
	var ProductList = Backbone.View.extend({
		defaults: {
			sortable: true,
			selectable: true,
			canTransact: false
		},
		initialize: function() {
			this.options = $.extend(this.defaults, this.options);
			if (!this.collection) {
				this.remove();
				return;
			}
			// if (this.options.canTransact) this.options.columns.unshift(this.gridSelectorRow);

			this.listenTo(this.collection, 'activeProductChange', this.onCollectionSelect);
			this.listenTo(this.collection, 'remove', this.refresh);
			this.listenTo(this.collection, 'modelEdit', this.refresh);
			this.render();
		},
		render: function() {
			var that = this;
			setTimeout(function() {
				that.options.scroll = false;
			}, 200);
			this.list = this.$el.kendoGrid(this.options).data("kendoGrid");
			this.list.dataSource.data(this.collection.toJSON());
		},
		gridSelectorRow: {title: "", template: "<input type='checkbox' class='select-product'>", width: 35, sortable: false, filterable: false },
		events: {
			'click tr.offer-row': 'onRowSelect',
			'click .place-order': 'placeOrder'
		},
		// adds the selected product to the selectedProducts collection and launches trader
		placeOrder: function(e) {
			e.preventDefault();
			var elem = $(e.currentTarget);
			var id = elem.parents('tr').attr('id').replace('offer-', '');
			var model = this.collection.get(id);
			SelectedProducts.reset();
			SelectedProducts.add(model);
			this.showTrader();
		},
		// shows the trader view
		showTrader: function() {
			Vm.create(this, 'Trader', TraderDialog, {productContext: 'capMarkets'});
			this.listenToOnce(Events, 'transactions:created', this.onOrderPlaced);
		},
		// refreshes the collection from the server when an order is placed
		onOrderPlaced: function() {
			this.collection.fetch({
				success: _.bind(this.refresh, this)
			});
		},
		refresh: function() {
			this.list.dataSource.data(this.collection.toJSON());
		},
		onCollectionSelect: function(model) {
			this.selectRowById(model.id);
		},
		onRowSelect: function(event) {
		//	event.preventDefault();
			var id = $(event.currentTarget).attr('id').replace('offer-', '');
			this.collection.setActiveModel(id);
		},
		/** 
		 * Selects a row by model id
		 * @param id, model id
		 */
		selectRowById: function(id) {
			this.list.select(this.$('#offer-' + id));
			if (this.options.scroll) {
				this.$(".k-grid-content").animate({  
					scrollTop: this.list.select().offset().top - this.$(".k-grid-content").offset().top
				}, 400);
				this.options.scroll = false;
			}
		},
		clean: function() {
			this.stopListening(this.collection);
		}
	});
	return ProductList;
});