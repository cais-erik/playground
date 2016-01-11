define([
	'underscore',
	'backbone',
	'models/product/syndicate_equity_offering'
], function(_, Backbone, CapMarketProduct){
	/** 
     * EquityOfferingCollection
     * Collection class for syndicate products
     */
	var CapitalMarketsCollection = Backbone.Collection.extend({
		url: '/api/products/syndicate/offerings/equity',
		activeProduct: null,
		initialize: function() {},
		model: CapMarketProduct,
		setActiveModel: function(id) {
			this.activeProduct = this.get(id);
			if (this.activeProduct) {
				this.trigger('activeProductChange', this.activeProduct);
			}
		}
	});
	return new CapitalMarketsCollection();
});