define([
	'underscore',
	'backbone',
	'collections/base_cais_collection'
], function(_, Backbone, BaseCollection) {
	var Product = Backbone.Model.extend({});

	var Products = BaseCollection.extend({
		baseUrl: '/getProductListByEntityId',
		model: Product,
		params: {
			investmentEntityId: null
		},
		initialize: function() {}
	});
	return Products;
});