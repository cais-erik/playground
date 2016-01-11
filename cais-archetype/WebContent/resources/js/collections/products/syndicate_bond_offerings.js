define([
	'underscore',
	'backbone',
	'models/product/syndicate_bond_offering'
], function(_, Backbone, BondOffering){
	/** 
     * BondOfferingsCollection
     * Collection class for syndicate products
     */
	var BondOfferingsCollection = Backbone.Collection.extend({
		url: '/api/products/syndicate/offerings/bond',
		activeProduct: null,
		initialize: function() {},
		model: BondOffering,
		setActiveModel: function(id) {
			this.activeProduct = this.get(id);
			if (this.activeProduct) {
				this.trigger('activeProductChange', this.activeProduct);
			}
		}
	});
	return new BondOfferingsCollection();
});