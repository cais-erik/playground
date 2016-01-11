define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'text!templates/products/trader/root_trader.html',
	'views/products/trader/trader_product_list',
	'views/products/trader/trade_summary',
	'views/assets/tabbed_entity_selector',
	'collections/products/selected_products',
	'collections/entities/selected_entities',
	'collections/products/transaction_collections'
], function ($, _, Backbone, Vm, Events, Handlebars, Template, TraderProductList, TradeSummary, EntitySelector, SelectedProducts, SelectedEntites, Transactions) {
	var RootTrader = Backbone.View.extend({
		template: Template,
		options: {},
		collection: Transactions.cmTransactions,
		initialize: function() {
			SelectedEntites.reset();
			this.collection = new this.collection();
			this.listenTo(SelectedEntites, 'add remove', this.onEntitySelect);
			this.render();
		},
		render: function() {
			this.$el.html(Template);
			this.$('.tabs').kendoTabStrip({
				animation: false,
				activate: _.bind(this.onTabChange, this)
			});
			this.validator = this.$el.kendoValidator().data('kendoValidator');

			this.productList = Vm.create(this, 'TraderProductList', TraderProductList, {el: this.$('.product-list')});
			this.entitySelector = Vm.create(this, 'AcctSelector', EntitySelector, {
				productContext: this.options.productContext,
				el: this.$('.accounts-list')
			});
			this.listenTo(this.entitySelector, 'singleSelected', this.firstEntitySelected);
		},
		events: {
			'click .place-transaction': 'placeTransaction',
			'click .add-new': 'showAcctSelector',
			'click .next': 'showNextClickHandler'
		},
		onTabChange: function(e) {
			if ($(e.item).hasClass('select-products')) {
				$('.next').addClass('hidden');
				$('.place-transaction').removeClass('hidden');
			} else {
				$('.next').removeClass('hidden');
				$('.place-transaction').addClass('hidden');
			}
		},
		showNextClickHandler: function(e){
			e.preventDefault();
			if ($(e.currentTarget).hasClass('btn-disabled')) return;
			this.selectNext();
		},
		firstEntitySelected: function() {
			this.$('.trader').addClass('single-selected');
			this.selectNext();
		},
		selectNext: function() {
			this.$('.k-tabstrip-items .k-state-active').next().click();
		},
		onEntitySelect: function(model, collection) {
			if (collection.length) {
				$('.next').removeClass('btn-disabled');
				$('.select-products').removeClass('k-state-disabled');
			} else {
				$('.next').addClass('btn-disabled');
				$('.select-products').addClass('k-state-disabled');
			}
		},
		placeTransaction: function(e) {
			var that = this;
			if (e) e.preventDefault();
			if (!this.validator.validate()) return;
			this.collection.createTransactions(SelectedProducts, SelectedEntites);
			
			this.collection.saveTransactions({
				success: function(response) {
					var success = Vm.create(that, 'TradeSummaryView', TradeSummary, {data: response});
					that.$el.fadeOut('fast', function() {
						that.$el.html(success.$el).fadeIn('slow');
					});
					Events.trigger('transactions:created', response);
				},
				error: function(response) {
					try {
						Alert('There was an error creating this transaction. Error ' + JSON.parse(response.responseText).error, 'OK');
					} catch(e) {
						Alert('There was an error creating this transaction on the server.', 'OK');
					}
				}
			});
		},
		clean: function() {
			this.stopListening();
		}
	});
	return RootTrader;
});