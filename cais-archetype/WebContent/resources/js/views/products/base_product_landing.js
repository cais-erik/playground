define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'handlebars',
	'models/authed_user'
], function ($, _, Backbone, Vm, Events, Handlebars, AuthUser) {
	var BaseCapMarkets = Backbone.View.extend({
		el: $('.workspace'), // rendered in base template
		template: null,
		products: null,
		productList: null,
		productViewer: null,
		options: {},
		name: 'Product Landing Page',
		initialize: function() {
			Events.on('domchange:title', this.changeTitle);
			this.listenTo(this.products, 'activeProductChange', function(model) {
				Events.trigger('offering:view', model.id);
			});
			this.productViewer = Vm.create(this, 'ProductViewer', this.productViewer, {collection: this.products});
			this.productList = Vm.create(this, 'ProductList', this.productList, {collection: this.products});
		},
		render: function() {
			Events.trigger('domchange:title', this.name);
			var template = Handlebars.compile(this.template);
			var context = {user:AuthUser.toJSON()};

			this.$('.main-column').html(template(context));
			this.$('.product-viewer').html(this.productViewer.$el);
			this.$('.product-list').html(this.productList.$el);

			this.productList.delegateEvents();
			this.productViewer.delegateEvents();
		},
		refresh: function(id) {
			if (!this.productList.$el) this.render();
			if (!this.productList.$el.is(':visible')) this.render();
			this.products.setActiveModel(id);
		},
		showFirst: function() {
			if (!this.productList.$el) this.render();
			if (!this.productList.$el.is(':visible')) this.render();
			var options = {
				replace: true,
				trigger: true
			};
			if (this.products.length) Events.trigger('offering:view', this.products.at(0).id, options);
		},
		events: {},
		/**
		 *	Renders a subview in the .main-column container
		 *  @param view, Backbone View class
		 *  @param options, View options object
		 */
		showView: function(view, options) {
			this.subView = Vm.create(this, 'Subview', view, options || {});
			this.$('.main-column').html(this.subView.$el);
		},
		/**	
		 *	Updates the title tag of the page
		 *  @param title, string, title of page
		 */
		changeTitle: function(title) {
			$(document).attr('title', title + ' | CAIS');
		}
	});
	return BaseCapMarkets;
});