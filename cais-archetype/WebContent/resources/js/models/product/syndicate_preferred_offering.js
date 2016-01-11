define([
	'underscore',
	'backbone',
	'models/product/base_product_model'
], function(_, Backbone, BaseModel){
	/** 
     * CapMarketPreferredOffering class
     * Model class for a syndicate preferred offering
     * Extends CapMarketProduct
	 */
	var CapMarketPreferredOffering = BaseModel.extend({
		defaults: {
			expectedTimingWindow: 'Before market close',
			assetClass: 'Preferred Stock',
			exchange: 'NYSE',
			offeringType: 'New Issue',
			expectedTimingDescription: 'Indications of interest will be accepted until 4pm, '
		},
		cacheName: 'CapMarketPreferred',
		idAttribute: 'internalCusip',
		urlRoot: '/api/products/syndicate/offerings/preferred',
		// override the toJSON method to map offering size and denominations to approxSize and priceRange
		toJSON: function() {
			var obj = _.clone(this.attributes);
			obj.approxSize = obj.actualSize;
			// obj.priceRange = obj.denominations; 
			return obj;
		},
		getName: function() { return this.get('name'); }
	});
	return CapMarketPreferredOffering;
});

