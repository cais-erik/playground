define([
	'underscore',
	'backbone',
	'models/product/base_product_model'
], function(_, Backbone, BaseModel){
	/** 
     * CapMarketBondOffering class
     * Model class for a syndicate preferred offering
     * Extends CapMarketProduct
	 */
	var CapMarketBondOffering = BaseModel.extend({
		defaults: {
			expectedTimingWindow: 'Before market close',
			assetClass: 'Bond',
			exchange: 'NYSE',
			offeringType: 'New Issue',
			expectedTimingDescription: 'Indications of interest will be accepted until 4pm, '
		},
		cacheName: 'CapMarketBond',
		idAttribute: 'internalCusip',
		urlRoot: '/api/products/syndicate/offerings/bond',
		// override the toJSON method to map offering size and denominations to approxSize and priceRange
		toJSON: function() {
			var obj = _.clone(this.attributes);
			obj.approxSize = obj.actualSize;
			// obj.priceRange = obj.denominations;
			return obj;
		},
		getName: function() { return this.get('name'); }
	});
	return CapMarketBondOffering;
});

