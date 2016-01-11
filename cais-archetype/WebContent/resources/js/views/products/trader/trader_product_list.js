define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'collections/products/selected_products',
	'collections/entities/selected_entities',
	'views/assets/tabbed_entity_selector',
	'views/products/trader/trader_entity_item',
	'text!templates/products/trader/product_list.html'
], function ($, _, Backbone, Vm, Events, Handlebars, SelectedProducts, SelectedEntities, EntitySelector, EntityItem, Template) {
	var RootTrader = Backbone.View.extend({
		//template: Template,
		options: {},
		collection: SelectedProducts,
		initialize: function() {
			this.listenTo(SelectedEntities, 'add', this.addOne);
			this.listenTo(SelectedEntities, 'remove', this.removeOne);
			this.render();
		},
		render: function() {
			var template = Handlebars.compile(Template);
			this.$el.html(Template);

			SelectedEntities.each(function(model){
				this.addOne(model);
			}, this);

			if (SelectedEntities.length) this.$('.empty-row').hide();
		},
		addOne: function(model, collection, options) {
			var that = this;
			var view = Vm.create(this, 'model' + model.id, EntityItem, {model: model});
			view.$el.hide().appendTo(that.$('.entity-list')).fadeIn('fast');
			model.initAdvisorTeams();
			if (SelectedEntities.length) this.$('.empty-row').hide();
		},
		removeOne: function(model, collection, options) {
			var that = this;
			this.$('#account-' + model.id).slideUp('slow', function() {
				$(this).remove();
				if (!collection.length) that.$('.empty-row').show();
			});
		},
		clean: function() {
			SelectedEntities.reset();
			this.stopListening();
		}
	});
	return RootTrader;
});