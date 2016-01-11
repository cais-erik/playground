define([
	'jquery',
	'underscore',
	'backbone',
	'Vm',
	'events',
	'models/authed_user',
	'views/products/base_product_landing',
	'views/assets/product_list/structured_products_list',
	'collections/products/structured_products',
	'views/assets/product_list/selected_product_list',
	'text!templates/products/structured_products/structured_product_landing.html'
], function ($, _, Backbone, Vm, Events, AuthUser, BaseProductLanding, ProductList, StructuredProducts, SelectedProductList, Template) {
	var StructuredProductsLanding = BaseProductLanding.extend({
		template: Template,
		products: StructuredProducts,
		productList: ProductList,
		selectedProductList: SelectedProductList,
		subView: {},
		name: 'Structured Solutions',
		el: $('.workspace'), // rendered in base template
		initialize: function() {
			Events.on('domchange:title', this.changeTitle);
			Events.trigger('domchange:title', this.name);
		},
		/**
		 *	Refreshes the product view with a new selected model
		 *  @param id, model id, pass null to clear selection
		 */
		refresh: function(id) {
			if (this.subView.className !== 'product-list') {
				this.showView(ProductList, {collection: this.products});
				this.subView.render();
			}
			this.products.setActiveModel(id);
		},
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
	return StructuredProductsLanding;
});