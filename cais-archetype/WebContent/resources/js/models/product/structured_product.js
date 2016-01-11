define([
	'underscore',
	'backbone',
	'models/product/base_product_model'
], function(_, Backbone, BaseModel) {
	/** 
     * StructuredProductDealTerms class
     * Model class for a structured product deal terms
	 */
	var StructuredProductDealTerms = Backbone.Model.extend({});

	/** 
     * StructuredProduct class
     * Model class for a structured product
	 */
	var StructuredProduct = BaseModel.extend({
		defaults: {
			issuerId: 1,
			offeringStatus: 1,
			productTypeId: 1
		},
		urlRoot: '/api/products/structured_solutions',
		cacheName: 'StructuredProduct',
		initialize: function() {
			this.dealTerms = new StructuredProductDealTerms(null, {
				url: this.urlRoot + '/' + this.get('internalCusip') + '/dealterms'
			});
		},
		getEditUrl: function() {
			return 'edit/' + this.id;
		},
		getName: function() { return this.get('title'); },
		// Populates the model with an existing model, unsetting attributes that should change between offerings
		prepopulate: function(model) {
			var obj = _.omit(model.toJSON(), ['id','type','terms','underlying','isExpired','isPublished']);
			this.set(obj);
		}
	});
	return StructuredProduct;
});