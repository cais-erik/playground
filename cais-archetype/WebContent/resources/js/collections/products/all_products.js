define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {
	var model = Backbone.Model.extend({
		idAttribute: 'productId',
		defaults: {
			'overview': true,
			'document': true,
			'performances': true,
			'mercer': true
		}
	});
	var ProductCollection = BaseCollection.extend({
		url: '/getAllProducts',
		model: model
	});
	return new ProductCollection();
});