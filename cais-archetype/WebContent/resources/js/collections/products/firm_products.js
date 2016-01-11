define([
	'underscore',
	'backbone',
	'collections/products/all_products'
], function(_, Backbone, AllProducts) {
	var model = Backbone.Model.extend({
		idAttribute: 'productId',
		defaults: {
			'overview': true,
			'document': true,
			'performances': true,
			'mercer': true
		},
		toJSON: function() {
			return _.pick(this.attributes, ['overview', 'document', 'performances', 'mercer', 'productId', 'legalName']);
		}
	});
	var ProductCollection = Backbone.Collection.extend({
		setUrl: function(firmId) {
			this.url = '/api/group/firm/' + firmId + '/products'
		},
		model : model
	});
	return ProductCollection;
});