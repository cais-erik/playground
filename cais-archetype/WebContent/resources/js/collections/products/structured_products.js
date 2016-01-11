define([
	'underscore',
	'backbone',
	'models/product/structured_product',
	'collections/setup/structured_products_menus'
], function(_, Backbone, StructuredProduct, StructuredProductMenus) {

	var StructuredProductCategories = Backbone.Collection.extend({
		url: '/api/products/structured_solutions/categories',
		initialize: function() {},
		comparator: 'name'
	});
	var Issuer = Backbone.Model.extend({
		idAttribute: 'issuerId'
	})
	var Issuers = Backbone.Collection.extend({
		url: '/api/products/structured_solutions/issuers',
		model: Issuer,
		initialize: function() {}
	});
	/** 
     * StructuredProductsCollection
     * Collection class for structured products
     */
	var StructuredProductsCollection = Backbone.Collection.extend({
		url: '/api/products/structured_solutions',
		activeProduct: null,
		comparator: 'underlying',
		model: StructuredProduct,
		categories: new StructuredProductCategories(),
		issuers: new Issuers(),
		setActiveModel: function(id) {
			this.activeProduct = this.get(id) || null;
			this.trigger('activeProductChange', this.activeProduct);
		},
		// serializes the categories with the counts in each category
		getCategories: function() {
			var categories = this.categories.toJSON();
			_.each(categories, function(category) {
				category.count = this.where({'spCategoryId': category.id}).length;
			}, this);
			return categories;
		},
		// override fetch method to insure StructuredProductMenus is loaded
		fetch: function() {
			var args = arguments;
			var that = this;
			StructuredProductMenus.getMenus(function(model) {
				that.categories.reset(model.get('categories'));
				that.issuers.reset(model.get('spissuer'));
				that.menus = model;
				Backbone.Model.prototype.fetch.apply(that, args);
			});
        },
		// map the issuer name to the product
		parse: function(response) {
			var issuers = this.menus.get('spissuer');
			$.each(response, function(i, product) {
				var issuer = _.findWhere(issuers, {issuerId: product.issuerId});
				product.issuerName = issuer.issuerName;
			});
			return response;
		}
	});
	return new StructuredProductsCollection();
});