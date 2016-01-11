define([
	'underscore',
	'backbone',
	'models/product/syndicate_preferred_offering'
], function(_, Backbone, PreferredOffering){
	/** 
     * CapitalMarketsCollection
     * Collection class for syndicate products
     */
	var PreferredOfferingsCollection = Backbone.Collection.extend({
		url: '/api/products/syndicate/offerings/preferred',
		activeProduct: null,
		initialize: function() {},
		model: PreferredOffering,
		setActiveModel: function(id) {
			this.activeProduct = this.get(id);
			if (this.activeProduct) {
				this.trigger('activeProductChange', this.activeProduct);
			}
		}
	});
	return new PreferredOfferingsCollection();
});